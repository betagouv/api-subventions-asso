import { ASSOCIATION_SEARCH_ENTITIES } from "../../../../../domain/__fixtures__/association-search.fixture";
import { addMonths } from "../../../../../shared/helpers/DateHelper";
import AssociationSearchDbo from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";
import { SireneEstablishmentDbo } from "../../../../outputs/db/sirene/sirene-establishment.dbo";
import { SireneEstablishmentPort } from "../../../../outputs/db/sirene/sirene-establishment.port";
import { SireneUniteLegalePort } from "../../../../outputs/db/sirene/sirene-unite-legale.port";
import { GeoApiPort } from "../../../../outputs/db/providers/geo-api/geo.port";
import { ParquetParser } from "../../../parquet.parser";
import SireneEstablishmentDto from "./sirene-establishment.dto";
import { SIRENE_ESTABLISHMENT_DTO } from "./sirene-establishment.fixture";
import { SireneEstablishmentMapper } from "./sirene-establishment.mapper";
import { SireneEstablishmentPipeline } from "./sirene-establishment.pipeline";

describe("SireneEstablishmentPipeline", () => {
    function* fakeParse(batches: SireneEstablishmentDto[][]) {
        for (const batch of batches) {
            yield batch;
        }
    }

    const SECONDARY_ESTABLISHMENT = {
        ...SIRENE_ESTABLISHMENT_DTO,
        nic: "00013",
        siret: `${SIRENE_ESTABLISHMENT_DTO.siren}00013`,
        etablissementSiege: false,
    };
    const SIREN_WITHOUT_MAIN_OFFICE_IN_BATCHES = "987654321";
    const OTHER_SECONDARY_ESTABLISHMENT = {
        ...SECONDARY_ESTABLISHMENT,
        siren: SIREN_WITHOUT_MAIN_OFFICE_IN_BATCHES,
        siret: `${SIREN_WITHOUT_MAIN_OFFICE_IN_BATCHES}00013`,
    };
    const BATCHES = [[SIRENE_ESTABLISHMENT_DTO, OTHER_SECONDARY_ESTABLISHMENT], [SECONDARY_ESTABLISHMENT]];

    const parser = {
        parse: jest.fn().mockImplementation(() => fakeParse(BATCHES)),
    } as unknown as jest.Mocked<ParquetParser<SireneEstablishmentDbo>>;

    const establishmentPort = {
        upsertMany: jest.fn(),
        getComputedFields: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<SireneEstablishmentPort>;
    const sireneUniteLegale = { filterExistingSirens: jest.fn() } as unknown as jest.Mocked<SireneUniteLegalePort>;
    const searchPort = {
        upsertFromEstablishment: jest.fn(),
    } as unknown as jest.Mocked<AssociationSearchPort>;
    const dataLog = { getLastEditionDateByProvider: jest.fn() } as unknown as jest.Mocked<DataLogPort>;
    const geoPort = {
        getAllDepartmentCodes: jest.fn().mockResolvedValue(["75", "2A", "974"]),
    } as unknown as jest.Mocked<GeoApiPort>;

    const ASSOCIATION_SEARCH: Required<Pick<AssociationSearchDbo, "siren" | "address">> = {
        siren: ASSOCIATION_SEARCH_ENTITIES[0].siren!.value,
        address: ASSOCIATION_SEARCH_ENTITIES[0].address!,
    };

    const spyToAssociationSearch = jest
        .spyOn(SireneEstablishmentMapper, "toAssociationSearch")
        .mockReturnValue(ASSOCIATION_SEARCH);

    type PipelineWithPrivates = { [K in keyof SireneEstablishmentPipeline]: SireneEstablishmentPipeline[K] } & {
        updateAssociationSearch: SireneEstablishmentPipeline["updateAssociationSearch"];
    };

    const pipeline = new SireneEstablishmentPipeline(
        parser,
        establishmentPort,
        sireneUniteLegale,
        searchPort,
        dataLog,
        geoPort,
    ) as unknown as PipelineWithPrivates;

    describe("run", () => {
        const mockUpdateAssociationSearch = jest.spyOn(pipeline, "updateAssociationSearch");

        beforeEach(() => {
            mockUpdateAssociationSearch.mockResolvedValue();
            establishmentPort.upsertMany.mockResolvedValue(1);
            sireneUniteLegale.filterExistingSirens.mockResolvedValue([
                SIRENE_ESTABLISHMENT_DTO.siren,
                SIREN_WITHOUT_MAIN_OFFICE_IN_BATCHES,
            ]);
            dataLog.getLastEditionDateByProvider.mockResolvedValue(null);
        });

        afterAll(() => {
            mockUpdateAssociationSearch.mockRestore();
        });

        it("filters establishments with existing association sirens", async () => {
            sireneUniteLegale.filterExistingSirens.mockResolvedValue([SIRENE_ESTABLISHMENT_DTO.siren]);
            await pipeline.run("file.parquet");
            expect(establishmentPort.upsertMany).toHaveBeenNthCalledWith(1, [SIRENE_ESTABLISHMENT_DTO]);
            expect(establishmentPort.upsertMany).toHaveBeenNthCalledWith(2, [SECONDARY_ESTABLISHMENT]);
        });

        it("filters establishments older than previous import edition date", async () => {
            dataLog.getLastEditionDateByProvider.mockResolvedValueOnce(
                addMonths(SIRENE_ESTABLISHMENT_DTO.dateDernierTraitementEtablissement, 1),
            );
            await pipeline.run("file.parquet");
            expect(establishmentPort.upsertMany).not.toHaveBeenCalled();
        });

        it("maps only head office addresses", async () => {
            await pipeline.run("file.parquet");
            expect(spyToAssociationSearch).toHaveBeenCalledTimes(1);
            expect(spyToAssociationSearch).toHaveBeenCalledWith(SIRENE_ESTABLISHMENT_DTO);
        });

        it("keeps the mian office address across batches and includes sirens without a main office", async () => {
            await pipeline.run("file.parquet");
            expect(mockUpdateAssociationSearch).toHaveBeenCalledWith(
                new Map([
                    [ASSOCIATION_SEARCH.siren, ASSOCIATION_SEARCH.address],
                    [SIREN_WITHOUT_MAIN_OFFICE_IN_BATCHES, undefined],
                ]),
            );
        });

        it("returns import report", async () => {
            const actual = await pipeline.run("file.parquet");
            // 3 parsed count from parse batch mock and 2 imported count from establishmentPort.updateMany mock
            expect(actual).toEqual({ parsedCount: 3, importedCount: 2, errorCount: 0 });
        });
    });

    describe("updateAssociationSearch", () => {
        const NB_ESTABS = 3;
        const POST_CODES = ["75013", "20000", "97400"];
        // @ts-expect-error: mock iterable
        establishmentPort.getComputedFields.mockReturnValue([
            {
                siren: SIRENE_ESTABLISHMENT_DTO.siren,
                nbEstabs: NB_ESTABS,
                postalCodes: ["75013", "20000", "97400"],
                communeCodes: ["75113", "2A004", "97411"],
            },
        ]);

        it("preserves the main address when only computed fields change", async () => {
            await pipeline.updateAssociationSearch(new Map([[ASSOCIATION_SEARCH.siren, undefined]]));
            expect(searchPort.upsertFromEstablishment).toHaveBeenCalledWith([
                {
                    siren: SIRENE_ESTABLISHMENT_DTO.siren,
                    nbEstabs: NB_ESTABS,
                    postalCodes: POST_CODES,
                    departmentCodes: ["75", "2A", "974"],
                },
            ]);
        });

        it("updates association search ", async () => {
            await pipeline.updateAssociationSearch(new Map([[ASSOCIATION_SEARCH.siren, ASSOCIATION_SEARCH.address]]));
            expect(searchPort.upsertFromEstablishment).toHaveBeenCalledWith([
                {
                    siren: ASSOCIATION_SEARCH.siren,
                    address: ASSOCIATION_SEARCH.address,
                    nbEstabs: NB_ESTABS,
                    postalCodes: POST_CODES,
                    departmentCodes: ["75", "2A", "974"],
                },
            ]);
        });
    });
});

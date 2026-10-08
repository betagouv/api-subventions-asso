import { ASSOCIATION_SEARCH_ENTITIES } from "../../../../../domain/__fixtures__/association-search.fixture";
import { addMonths } from "../../../../../shared/helpers/DateHelper";
import AssociationSearchDbo from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";
import { SireneEstablishmentDbo } from "../../../../outputs/db/sirene/sirene-establishment.dbo";
import { SireneEstablishmentPort } from "../../../../outputs/db/sirene/sirene-establishment.port";
import { SireneUniteLegalePort } from "../../../../outputs/db/sirene/sirene-unite-legale.port";
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

    const BATCHES = [[SIRENE_ESTABLISHMENT_DTO, SIRENE_ESTABLISHMENT_DTO], [SIRENE_ESTABLISHMENT_DTO]];

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

    const ASSOCIATION_SEARCH: Required<Pick<AssociationSearchDbo, "siren" | "address">> = {
        siren: ASSOCIATION_SEARCH_ENTITIES[0].siren!.value,
        address: ASSOCIATION_SEARCH_ENTITIES[0].address!,
    };

    const spyToAssociationSearch = jest
        .spyOn(SireneEstablishmentMapper, "toAssociationSearch")
        .mockReturnValue(ASSOCIATION_SEARCH);

    type PipelineWithPrivates = { [K in keyof SireneEstablishmentPipeline]: SireneEstablishmentPipeline[K] } & {
        filterMainEstab: SireneEstablishmentPipeline["filterMainEstab"];
        updateAssociationSearch: SireneEstablishmentPipeline["updateAssociationSearch"];
        filterAssociationEstablishments: SireneEstablishmentPipeline["filterAssociationEstablishments"];
    };

    const pipeline = new SireneEstablishmentPipeline(
        parser,
        establishmentPort,
        sireneUniteLegale,
        searchPort,
        dataLog,
    ) as unknown as PipelineWithPrivates;

    describe("run", () => {
        const mockFilterMainEstab = jest.spyOn(pipeline as PipelineWithPrivates, "filterMainEstab");

        const mockUpdateAssociationSearch = jest.spyOn(pipeline, "updateAssociationSearch");

        const mockFilterAssociationEstablishments = jest.spyOn(pipeline, "filterAssociationEstablishments");

        beforeEach(() => {
            // @ts-expect-error: mock implementation / bypass the filtering
            mockFilterAssociationEstablishments.mockImplementation(dtos => dtos);
            mockFilterMainEstab.mockReturnValue([SIRENE_ESTABLISHMENT_DTO]);
            mockUpdateAssociationSearch.mockResolvedValue();
            establishmentPort.upsertMany.mockResolvedValue(1);
            sireneUniteLegale.filterExistingSirens.mockResolvedValue([SIRENE_ESTABLISHMENT_DTO.siren]);
            dataLog.getLastEditionDateByProvider.mockResolvedValue(null);
        });

        afterAll(() => {
            [mockFilterMainEstab, mockUpdateAssociationSearch, mockFilterAssociationEstablishments].forEach(mock =>
                mock.mockRestore(),
            );
        });

        it("filters establishments with existing association sirens", async () => {
            await pipeline.run("file.parquet");
            expect(establishmentPort.upsertMany).toHaveBeenCalledWith([SIRENE_ESTABLISHMENT_DTO]);
        });

        it("filters establishments older than previous import edition date", async () => {
            dataLog.getLastEditionDateByProvider.mockResolvedValueOnce(
                addMonths(SIRENE_ESTABLISHMENT_DTO.dateDernierTraitementEtablissement, 1),
            );
            await pipeline.run("file.parquet");
            expect(establishmentPort.upsertMany).not.toHaveBeenCalled();
        });

        it("filters main establishment dtos", async () => {
            await pipeline.run("file.parquet");
            expect(mockFilterMainEstab).toHaveBeenCalledWith([SIRENE_ESTABLISHMENT_DTO]);
        });

        it("transforms most recent dtos into association-search", async () => {
            await pipeline.run("file.parquet");
            // mockFilterMainEstab only return one PARTIAL_DBO so we replace each batch with only one PARTIAL_DBO
            BATCHES.map(_batch => SIRENE_ESTABLISHMENT_DTO).forEach((partial, index) => {
                expect(spyToAssociationSearch).toHaveBeenNthCalledWith(index + 1, partial); // this is from mockFilterMainEstab
            });
        });

        it("updates association-search", async () => {
            await pipeline.run("file.parquet");
            // from two filterMostRecent() mock calls
            expect(mockUpdateAssociationSearch).toHaveBeenCalledWith([ASSOCIATION_SEARCH, ASSOCIATION_SEARCH]);
        });

        it("returns import report", async () => {
            const actual = await pipeline.run("file.parquet");
            // 3 parsed count from parse batch mock and 2 imported count from establishmentPort.updateMany mock
            expect(actual).toEqual({ parsedCount: 3, importedCount: 2, errorCount: 0 });
        });
    });

    describe("filterMainEstab", () => {
        const DTOS = [
            { ...SIRENE_ESTABLISHMENT_DTO, etablissementSiege: true },
            { ...SIRENE_ESTABLISHMENT_DTO, etablissementSiege: false },
        ];

        it("returns partial main establishment dto", async () => {
            const expected = DTOS.filter(dto => dto.etablissementSiege).map(dto => ({
                siren: dto.siren,
                numeroVoieEtablissement: dto.numeroVoieEtablissement,
                typeVoieEtablissement: dto.typeVoieEtablissement,
                libelleVoieEtablissement: dto.libelleVoieEtablissement,
                libelleCommuneEtablissement: dto.libelleCommuneEtablissement,
                codePostalEtablissement: dto.codePostalEtablissement,
                dateDernierTraitementEtablissement: dto.dateDernierTraitementEtablissement,
            }));
            const actual = await pipeline.filterMainEstab(DTOS);
            expect(actual).toEqual(expected);
        });
    });

    describe("updateAssociationSearch", () => {
        const NB_ESTABS = 4;
        const POST_CODES = ["75000", "35000", "73000", "29000"];
        // @ts-expect-error: mock iterable
        establishmentPort.getComputedFields.mockReturnValue([
            {
                siren: SIRENE_ESTABLISHMENT_DTO.siren,
                nbEstabs: NB_ESTABS,
                postalCodes: ["75000", "35000", "73000", "29000"],
            },
        ]);

        it("updates association search ", async () => {
            await pipeline.updateAssociationSearch([
                { siren: ASSOCIATION_SEARCH.siren, address: ASSOCIATION_SEARCH.address },
            ]);
            expect(searchPort.upsertFromEstablishment).toHaveBeenCalledWith([
                {
                    siren: ASSOCIATION_SEARCH.siren,
                    address: ASSOCIATION_SEARCH.address,
                    nbEstabs: NB_ESTABS,
                    postalCodes: POST_CODES,
                },
            ]);
        });
    });
});

import { ASSOCIATION_SEARCH_ENTITIES } from "../../../../../domain/__fixtures__/association-search.fixture";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";
import { SireneEstablishmentPort } from "../../../../outputs/db/sirene/sirene-establishment.port";
import { SireneUniteLegalePort } from "../../../../outputs/db/sirene/sirene-unite-legale.port";
import { SIRENE_ESTABLISHMENT_DTO } from "./sirene-establishment.fixture";
import { SireneEstablishmentMapper } from "./sirene-establishment.mapper";
import SireneEstablishmentParser from "./sirene-establishment.parser";
import { SireneEstablishmentPipeline } from "./sirene-establishment.pipeline";

describe("SireneEstablishmentPipeline", () => {
    const parser = { parse: jest.fn() } as unknown as jest.Mocked<SireneEstablishmentParser>;
    const postalCodesBySiren = [{ siren: SIRENE_ESTABLISHMENT_DTO.siren, postalCodes: ["75001"] }];
    const establishmentPort = {
        upsertMany: jest.fn(),
        getPostalCodesBySirens: jest.fn(),
    } as unknown as jest.Mocked<SireneEstablishmentPort>;
    const sireneUniteLegale = { filterExistingSirens: jest.fn() } as unknown as jest.Mocked<SireneUniteLegalePort>;
    const searchPort = {
        upsertMany: jest.fn(),
        updatePostalCodesBySirens: jest.fn(),
    } as unknown as jest.Mocked<AssociationSearchPort>;
    const dataLog = { getLastEditionDateByProvider: jest.fn() } as unknown as jest.Mocked<DataLogPort>;

    describe("run", () => {
        const pipeline = new SireneEstablishmentPipeline(
            parser,
            establishmentPort,
            sireneUniteLegale,
            searchPort,
            dataLog,
        );

        // @ts-expect-error: mock private method
        const mockUpdateAssociationSearch = jest.spyOn(pipeline, "updateAssociationSearch").mockResolvedValue();

        beforeEach(() => {
            jest.clearAllMocks();
            // @ts-expect-error: mock parse
            parser.parse.mockImplementation(async (_filePath, onBatch) => onBatch([SIRENE_ESTABLISHMENT_DTO]));
            establishmentPort.upsertMany.mockResolvedValue(1);
            establishmentPort.getPostalCodesBySirens.mockResolvedValue(postalCodesBySiren);
            sireneUniteLegale.filterExistingSirens.mockResolvedValue([SIRENE_ESTABLISHMENT_DTO.siren]);
            dataLog.getLastEditionDateByProvider.mockResolvedValue(null);
        });

        it("filters establishments with existing association sirens", async () => {
            await pipeline.run("file.parquet");
            expect(establishmentPort.upsertMany).toHaveBeenCalledWith([SIRENE_ESTABLISHMENT_DTO]);
        });

        it("filters establishments older than previous import edition date", async () => {
            dataLog.getLastEditionDateByProvider.mockResolvedValueOnce(new Date("2026-07-09"));
            await pipeline.run("file.parquet");
            expect(establishmentPort.upsertMany).toHaveBeenCalledWith([]);
        });

        it("updates association-search", async () => {
            await pipeline.run("file.parquet");
            expect(mockUpdateAssociationSearch).toHaveBeenCalledWith([SIRENE_ESTABLISHMENT_DTO]);
        });

        it("updates association-search postal codes from imported establishment sirens", async () => {
            await pipeline.run("file.parquet");
            expect(searchPort.updatePostalCodesBySirens).toHaveBeenCalledWith(postalCodesBySiren);
        });

        it("returns import report", async () => {
            const actual = await pipeline.run("file.parquet");
            expect(actual).toEqual({ parsedCount: 1, importedCount: 1, errorCount: 0 });
        });
    });

    describe("updateAssociationSearch", () => {
        const pipeline = new SireneEstablishmentPipeline(
            parser,
            establishmentPort,
            sireneUniteLegale,
            searchPort,
            dataLog,
        );

        const ASSOCIATION_SEARCH = {
            siren: ASSOCIATION_SEARCH_ENTITIES[0].siren.value,
            address: ASSOCIATION_SEARCH_ENTITIES[0].address,
        };
        const DTOS = [{ ...SIRENE_ESTABLISHMENT_DTO, etablissementSiege: true }];

        const spyToAssociationSearch = jest
            .spyOn(SireneEstablishmentMapper, "toAssociationSearch")
            .mockReturnValue(ASSOCIATION_SEARCH);

        it("transform dto into association-search", async () => {
            // @ts-expect-error: test private method
            await pipeline.updateAssociationSearch(DTOS);
            expect(spyToAssociationSearch).toHaveBeenCalledWith(DTOS[0]);
        });

        it("updates association-search", async () => {
            // @ts-expect-error: test private method
            await pipeline.updateAssociationSearch(DTOS);
            expect(searchPort.upsertMany).toHaveBeenCalledWith([ASSOCIATION_SEARCH]);
        });
    });
});

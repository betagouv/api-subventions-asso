import { SIRENE_ESTABLISHMENT_DTO } from "./sirene-establishment.fixture";
import { SireneEstablishmentImport } from "./sirene-establishment.import";

describe("SireneEstablishmentImport", () => {
    const parser = { parse: jest.fn() };
    const establishmentPort = { upsertMany: jest.fn() };
    const sireneUniteLegale = { collectionIsNotEmpty: jest.fn(), filterExistingSirens: jest.fn() };
    const dataLog = { getLastEditionDateByProvider: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        parser.parse.mockImplementation(async (_filePath, onBatch) => onBatch([SIRENE_ESTABLISHMENT_DTO]));
        establishmentPort.upsertMany.mockResolvedValue(1);
        sireneUniteLegale.collectionIsNotEmpty.mockResolvedValue(true);
        sireneUniteLegale.filterExistingSirens.mockResolvedValue([SIRENE_ESTABLISHMENT_DTO.siren]);
        dataLog.getLastEditionDateByProvider.mockResolvedValue(null);
    });

    it("throws when sirene collection is empty", async () => {
        sireneUniteLegale.collectionIsNotEmpty.mockResolvedValueOnce(false);
        await expect(
            new SireneEstablishmentImport(
                parser as never,
                establishmentPort as never,
                sireneUniteLegale as never,
                dataLog,
            ).run("file.parquet"),
        ).rejects.toThrow("Sirene unite legale collection must be imported before establishments");
    });

    it("filters establishments with existing association sirens", async () => {
        await new SireneEstablishmentImport(
            parser as never,
            establishmentPort as never,
            sireneUniteLegale as never,
            dataLog,
        ).run("file.parquet");
        expect(establishmentPort.upsertMany).toHaveBeenCalledWith([SIRENE_ESTABLISHMENT_DTO]);
    });

    it("filters establishments older than previous import edition date", async () => {
        dataLog.getLastEditionDateByProvider.mockResolvedValueOnce(new Date("2026-07-09"));
        await new SireneEstablishmentImport(
            parser as never,
            establishmentPort as never,
            sireneUniteLegale as never,
            dataLog,
        ).run("file.parquet");
        expect(establishmentPort.upsertMany).toHaveBeenCalledWith([]);
    });

    it("returns import report", async () => {
        const actual = await new SireneEstablishmentImport(
            parser as never,
            establishmentPort as never,
            sireneUniteLegale as never,
            dataLog,
        ).run("file.parquet");
        expect(actual).toEqual({ parsedCount: 1, importedCount: 1, errorCount: 0 });
    });
});

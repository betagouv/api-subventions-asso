import { SIRENE_ESTABLISHMENT_DTO } from "./sirene-establishment.fixture";
import { SireneEstablishmentImport } from "./sirene-establishment.import";

describe("SireneEstablishmentImport", () => {
    const parser = { parse: jest.fn() };
    const establishmentPort = { insertMany: jest.fn() };
    const sireneUniteLegale = { collectionIsNotEmpty: jest.fn(), filterExistingSirens: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        parser.parse.mockImplementation(async (_filePath, onBatch) => onBatch([SIRENE_ESTABLISHMENT_DTO]));
        establishmentPort.insertMany.mockResolvedValue(1);
        sireneUniteLegale.collectionIsNotEmpty.mockResolvedValue(true);
        sireneUniteLegale.filterExistingSirens.mockResolvedValue([SIRENE_ESTABLISHMENT_DTO.siren]);
    });

    it("throws when sirene collection is empty", async () => {
        sireneUniteLegale.collectionIsNotEmpty.mockResolvedValueOnce(false);
        await expect(
            new SireneEstablishmentImport(parser as never, establishmentPort as never, sireneUniteLegale as never).run(
                "file.parquet",
            ),
        ).rejects.toThrow("Sirene unite legale collection must be imported before establishments");
    });

    it("filters establishments with existing association sirens", async () => {
        await new SireneEstablishmentImport(
            parser as never,
            establishmentPort as never,
            sireneUniteLegale as never,
        ).run("file.parquet");
        expect(establishmentPort.insertMany).toHaveBeenCalledWith([SIRENE_ESTABLISHMENT_DTO]);
    });

    it("returns import report", async () => {
        const actual = await new SireneEstablishmentImport(
            parser as never,
            establishmentPort as never,
            sireneUniteLegale as never,
        ).run("file.parquet");
        expect(actual).toEqual({ parsedCount: 1, importedCount: 1, errorCount: 0 });
    });
});

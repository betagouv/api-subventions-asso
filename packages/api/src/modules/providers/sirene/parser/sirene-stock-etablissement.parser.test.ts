import fs from "fs";
import SireneStockEtablissementParser from "./sirene-stock-etablissement.parser";

jest.mock(
    "hyparquet",
    () => ({
        asyncBufferFromFile: jest.fn(),
        parquetMetadataAsync: jest.fn(),
        parquetRead: jest.fn(),
    }),
    { virtual: true },
);

jest.mock(
    "hyparquet-compressors",
    () => ({
        compressors: {},
    }),
    { virtual: true },
);

jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    existsSync: jest.fn().mockReturnValue(true),
}));

describe("SireneStockEtablissementParser", () => {
    describe("parseParquetAndInsert", () => {
        const saveBatch = jest.fn();
        const findAssociationSirens = jest.fn();

        afterEach(() => {
            saveBatch.mockClear();
            findAssociationSirens.mockClear();
            jest.mocked(fs.existsSync).mockReturnValue(true);
        });

        it("throws if file is not provided", async () => {
            await expect(
                SireneStockEtablissementParser.parseParquetAndInsert("", findAssociationSirens, saveBatch),
            ).rejects.toThrow("Parse command need file args");
        });

        it("throws if file does not exist", async () => {
            jest.mocked(fs.existsSync).mockReturnValue(false);
            await expect(
                SireneStockEtablissementParser.parseParquetAndInsert("file.parquet", findAssociationSirens, saveBatch),
            ).rejects.toThrow("File not found file.parquet");
        });
    });

    describe("formatProgress", () => {
        it("returns count over total with percentage", () => {
            expect(SireneStockEtablissementParser.formatProgress(33, 100)).toBe("33/100 (33.00%)");
        });
    });
});

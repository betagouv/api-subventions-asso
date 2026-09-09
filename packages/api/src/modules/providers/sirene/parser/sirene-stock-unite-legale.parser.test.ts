import fs from "fs";
import SireneStockUniteLegaleParser from "./sirene-stock-unite-legale.parser";
import { DTOS } from "../__fixtures__/sirene-unite-legale.fixture";
import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";

const BUFFER = Buffer.from([]);
const METADATA = { num_rows: 5001 };
const mockAsyncBufferFromFile = jest.fn().mockResolvedValue(BUFFER);
const mockParquetMetadataAsync = jest.fn().mockResolvedValue(METADATA);
const mockParquetReadObjects = jest.fn();
const mockCompressors = jest.fn();

async function collectParse(filePath: string) {
    const batches: SireneUniteLegaleDto[][] = [];
    for await (const batch of SireneStockUniteLegaleParser.parse(filePath)) {
        batches.push(batch);
    }
    return batches;
}

jest.mock("fs", () => {
    const actualFs = jest.requireActual("fs");
    return {
        ...actualFs,
        existsSync: jest.fn().mockReturnValue(true),
    };
});

jest.mock("../../../../adapters/inputs/hyparquet.loader", () => ({
    loadHyparquet: () => ({
        asyncBufferFromFile: mockAsyncBufferFromFile,
        parquetMetadataAsync: mockParquetMetadataAsync,
        parquetReadObjects: mockParquetReadObjects,
        compressors: mockCompressors,
    }),
}));

const PARQUET_BATCHES = [[DTOS[0], DTOS[2]], [DTOS[1]]];
const PARQUET_DATE_WITHOUT_TIME = new Date(`${DTOS[0].dateCreationUniteLegale}T00:00:00.000Z`);
const PARQUET_DATE_WITH_TIME = new Date(`${DTOS[0].dateDernierTraitementUniteLegale}.000Z`);

describe("SireneStockUniteLegaleParser", () => {
    describe("filePathValidator", () => {
        it("should throw an error if file is not provided", () => {
            expect(() => SireneStockUniteLegaleParser.filePathValidator("")).toThrow("Parse command need file args");
        });

        it("should call fs.existsSync if a filePath is given", () => {
            const filePath = "file";
            SireneStockUniteLegaleParser.filePathValidator(filePath);
            expect(fs.existsSync).toHaveBeenCalledWith(filePath);
        });

        it("should throw an error if file does not exist", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(false);
            expect(() => SireneStockUniteLegaleParser.filePathValidator("file")).toThrow("File not found file");
        });

        it("should return true if file exists", () => {
            expect(SireneStockUniteLegaleParser.filePathValidator("file")).toBe(true);
        });
    });

    describe("parse", () => {
        const filePath = "file.parquet";
        let mockFilePathValidator: jest.SpyInstance;

        beforeEach(() => {
            jest.clearAllMocks();
            mockFilePathValidator = jest.spyOn(SireneStockUniteLegaleParser, "filePathValidator").mockReturnValue(true);
            mockParquetMetadataAsync.mockResolvedValue(METADATA);
            mockParquetReadObjects.mockImplementation(({ rowStart }) =>
                Promise.resolve(rowStart === 0 ? PARQUET_BATCHES[0] : PARQUET_BATCHES[1]),
            );
        });

        afterEach(() => {
            mockFilePathValidator.mockRestore();
        });

        it("should call filePathValidator", async () => {
            await collectParse(filePath);
            expect(mockFilePathValidator).toHaveBeenCalledWith(filePath);
        });

        it("should get file buffer", async () => {
            await collectParse(filePath);
            expect(mockAsyncBufferFromFile).toHaveBeenCalledWith(filePath);
        });

        it("should get file metadata", async () => {
            await collectParse(filePath);
            expect(mockParquetMetadataAsync).toHaveBeenCalledWith(BUFFER);
        });

        it("should read rows by parquet batch", async () => {
            await collectParse(filePath);
            expect(mockParquetReadObjects.mock.calls.map(([args]) => args)).toEqual([
                {
                    file: BUFFER,
                    compressors: mockCompressors,
                    metadata: METADATA,
                    rowFormat: "object",
                    rowStart: 0,
                    rowEnd: 5000,
                },
                {
                    file: BUFFER,
                    compressors: mockCompressors,
                    metadata: METADATA,
                    rowFormat: "object",
                    rowStart: 5000,
                    rowEnd: 5001,
                },
            ]);
        });

        it("should yield normalized dto batches", async () => {
            const actual = await collectParse(filePath);
            expect(actual).toEqual(PARQUET_BATCHES);
        });

        it("should throw an error if parquet reading fails", async () => {
            mockParquetReadObjects.mockRejectedValueOnce(new Error("error"));

            const result = collectParse(filePath);

            await expect(result).rejects.toThrowError("error");
        });
    });

    describe("parquetRowToDto", () => {
        it("should normalize parquet values like the previous csv payload", () => {
            const actual = SireneStockUniteLegaleParser.parquetRowToDto({
                ...DTOS[0],
                unitePurgeeUniteLegale: false,
                dateCreationUniteLegale: PARQUET_DATE_WITHOUT_TIME,
                dateDernierTraitementUniteLegale: PARQUET_DATE_WITH_TIME,
                nombrePeriodesUniteLegale: BigInt(5),
                anneeEffectifsUniteLegale: null,
            });

            expect(actual).toMatchObject({
                unitePurgeeUniteLegale: "",
                dateCreationUniteLegale: DTOS[0].dateCreationUniteLegale,
                dateDernierTraitementUniteLegale: DTOS[0].dateDernierTraitementUniteLegale,
                nombrePeriodesUniteLegale: "5",
                anneeEffectifsUniteLegale: "",
            });
        });
    });

    describe("formatProgress", () => {
        it("returns count over total with percentage", () => {
            expect(SireneStockUniteLegaleParser.formatProgress(25, 100)).toBe("25/100 (25.00%)");
        });
    });
});

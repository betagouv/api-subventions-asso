import parquetParser from "./parquet.parser";

const BUFFER = Buffer.from([]);
const METADATA = { num_rows: 5001 };
const NATIVE_ROW = {
    date: new Date("2026-09-16T00:00:00.000Z"),
    count: 5n,
    active: true,
    missing: null,
};

const mockCompressors = jest.fn();
const mockAsyncBufferFromFile = jest.fn().mockResolvedValue(BUFFER);
const mockParquetMetadataAsync = jest.fn().mockResolvedValue(METADATA);
const mockParquetReadObjects = jest
    .fn()
    .mockImplementation(({ rowStart }) =>
        Promise.resolve(rowStart === 0 ? [NATIVE_ROW] : [{ ...NATIVE_ROW, count: 6n }]),
    );

jest.mock("./hyparquet.loader", () => ({
    loadHyparquet: () => ({
        asyncBufferFromFile: mockAsyncBufferFromFile,
        parquetMetadataAsync: mockParquetMetadataAsync,
        parquetReadObjects: mockParquetReadObjects,
        compressors: mockCompressors,
    }),
}));

async function collectParse(filePath: string) {
    const batches: Record<string, unknown>[][] = [];

    for await (const batch of parquetParser.parse(filePath)) batches.push(batch);

    return batches;
}

describe("ParquetParser", () => {
    const FILE_PATH = "/path/to/file.parquet";

    describe("parse", () => {
        it("reads parquet rows by batch", async () => {
            await collectParse(FILE_PATH);

            const actual = mockParquetReadObjects.mock.calls.map(([args]) => args);
            const expected = [
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
            ];

            expect(actual).toEqual(expected);
        });

        it("yields native parquet values", async () => {
            const actual = await collectParse(FILE_PATH);

            expect(actual).toEqual([[NATIVE_ROW], [{ ...NATIVE_ROW, count: 6n }]]);
        });
    });
});

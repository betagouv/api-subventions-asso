import { RnaWaldecDto } from "./rna.dto";
import { RNA_WALDEC_DTO } from "./rna.dto.fixture";
import rnaParser from "./rna.parser";

const BUFFER = Buffer.from([]);
const METADATA = { num_rows: 5001 }; // simulate two batch
const mockAsyncBufferFromFile = jest.fn().mockResolvedValue(BUFFER);
const mockParquetMetadataAsync = jest.fn().mockResolvedValue(METADATA);
const mockParquetReadObjects = jest.fn().mockResolvedValue([RNA_WALDEC_DTO]);
const mockCompressors = jest.fn();

jest.mock("../../../hyparquet.loader", () => ({
    loadHyparquet: () => ({
        asyncBufferFromFile: mockAsyncBufferFromFile,
        parquetMetadataAsync: mockParquetMetadataAsync,
        parquetReadObjects: mockParquetReadObjects,
        compressors: mockCompressors,
    }),
}));

describe("RnaParser", () => {
    const FILE_PATH = "/path/to/file";

    let batches = [] as RnaWaldecDto[][];

    afterEach(() => (batches = []));

    // consumes generator to fully test the code
    async function setupTest() {
        for await (const batch of rnaParser.parse(FILE_PATH)) {
            batches.push(batch);
        }
    }

    describe("parse", () => {
        it("get file buffer", async () => {
            await setupTest();
            expect(mockAsyncBufferFromFile).toHaveBeenCalledWith(FILE_PATH);
        });

        it("gets file metadata", async () => {
            await setupTest();
            expect(mockParquetMetadataAsync).toHaveBeenCalledWith(BUFFER);
        });

        it("reads rows by batch", async () => {
            await setupTest();
            batches.forEach((_batch, index) => {
                expect(mockParquetReadObjects).toHaveBeenNthCalledWith(index + 1, {
                    file: BUFFER,
                    compressors: mockCompressors,
                    rowFormat: "object",
                    metadata: METADATA,
                    rowStart: 0 + index * 5000,
                    rowEnd: 5000 + index * 1, // trick to simulate 5001 lines with two batch (last with only one row)
                });
            });
        });

        it("yields batch of dto", async () => {
            await setupTest();
            expect(batches).toEqual([[RNA_WALDEC_DTO], [RNA_WALDEC_DTO]]);
        });
    });
});

import { ParquetParser } from "../../../parquet.parser";
import { RnaParser } from "./rna.parser";

describe("RnaParser", () => {
    describe("parse", () => {
        it("delegates parquet parsing", () => {
            const FILE_PATH = "/path/to/file.parquet";
            const batches = (async function* () {
                yield [];
            })();
            const parser = { parse: jest.fn().mockReturnValue(batches) } as unknown as ParquetParser;

            const actual = new RnaParser(parser).parse(FILE_PATH);

            expect({ result: actual, calls: jest.mocked(parser.parse).mock.calls }).toEqual({
                result: batches,
                calls: [[FILE_PATH]],
            });
        });
    });
});

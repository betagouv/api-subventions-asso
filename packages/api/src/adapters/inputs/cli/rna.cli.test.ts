import { RnaPipeline } from "../pipeline/import/rna/rna.pipeline";
import { RnaCli } from "./rna.cli";

describe("Rna CLI", () => {
    describe("parse", () => {
        const FILE_PATH = "/path/to/file";

        it("runs import pipeline", async () => {
            const mockPipeline = { run: jest.fn() } as unknown as RnaPipeline;
            const cli = new RnaCli(mockPipeline);
            await cli._parse(FILE_PATH);
            expect(mockPipeline.run).toHaveBeenCalledWith(FILE_PATH);
        });
    });
});

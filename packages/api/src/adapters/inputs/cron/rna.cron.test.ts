import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
import { RnaCron } from "./rna.cron";

describe("Rna CRON", () => {
    const mockPipeline = { run: jest.fn() } as unknown as DownloadAndImport;

    const cron = new RnaCron(mockPipeline) as unknown as RnaCron;

    describe("import", () => {
        it("runs download and import pipeline", async () => {
            await cron.import();
            expect(mockPipeline.run).toHaveBeenCalled();
        });
    });
});

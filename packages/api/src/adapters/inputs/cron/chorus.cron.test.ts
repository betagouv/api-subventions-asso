import { GetNewS3File } from "../../../modules/s3-file/use-cases/get-new-s3-file";
import { TagImportedFile } from "../../../modules/s3-file/use-cases/tag-imported-file";
import DownloadFile from "../../../usecases/download-file";
import { ChorusPipeline } from "../pipeline/import/chorus/chorus.pipeline";
import { ChorusCron } from "./chorus.cron";

const BUFFER = Buffer.from([]);

jest.mock("fs", () => ({
    promises: {
        readFile: jest.fn().mockImplementation(() => BUFFER),
    },
}));

describe("Chorus CRON", () => {
    describe("importNewFile", () => {
        const FILES_PATH = ["/providers/chorus/2026/data-1.xlsx", "/providers/chorus/2026/data-2.xlsx"];
        const mockGetFiles = {
            execute: jest.fn().mockResolvedValue([
                { path: FILES_PATH[0], importDate: new Date("2026-03-20") },
                { path: FILES_PATH[1], importDate: new Date("2026-04-20") },
            ]),
        } as unknown as GetNewS3File;
        const mockDownloadFile = {
            execute: jest.fn().mockResolvedValue({ filePath: FILES_PATH[1] }),
        } as unknown as jest.Mocked<DownloadFile>;
        const mockChorusPipeline = { run: jest.fn() } as unknown as ChorusPipeline;
        const mockTagFile = { execute: jest.fn() } as unknown as TagImportedFile;

        const cron = new ChorusCron(mockGetFiles, mockDownloadFile, mockChorusPipeline, mockTagFile);

        beforeAll(() => {
            jest.useFakeTimers().setSystemTime(new Date("2026-05-20"));
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("get stored files", async () => {
            await cron.importNewFile();
            expect(mockGetFiles.execute).toHaveBeenCalledWith("providers/chorus/2026"); // year set with jest.useFakeTimers()
        });

        it("get most recent file ", async () => {
            await cron.importNewFile();
            expect(mockDownloadFile.execute).toHaveBeenCalledWith(FILES_PATH[1]);
        });

        it("runs import", async () => {
            await cron.importNewFile();
            expect(mockChorusPipeline.run).toHaveBeenCalledWith(BUFFER);
        });
    });
});

import { GetFileData } from "../../../modules/s3-file/use-cases/get-file-data";
import { GetNewS3File } from "../../../modules/s3-file/use-cases/get-new-s3-file";
import { ChorusImport } from "../pipeline/import/chorus/chorus.import";
import { ChorusCron } from "./chorus.cron";

describe("Chorus CRON", () => {
    describe("importNewFile", () => {
        const FILES_PATH = ["/providers/chorus/2026/data-1.xlsx", "/providers/chorus/2026/data-2.xlsx"];
        const mockGetFiles = {
            execute: jest.fn().mockResolvedValue([
                { path: FILES_PATH[0], importDate: new Date("2026-03-20") },
                { path: FILES_PATH[1], importDate: new Date("2026-04-20") },
            ]),
        } as unknown as GetNewS3File;
        const mockGetFileData = { execute: jest.fn().mockResolvedValue(Buffer.from([])) } as unknown as GetFileData;
        const mockChorusImport = { run: jest.fn() } as unknown as ChorusImport;

        const cron = new ChorusCron(mockGetFiles, mockGetFileData, mockChorusImport);

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
            expect(mockGetFileData.execute).toHaveBeenCalledWith(FILES_PATH[1]);
        });
    });
});

import fs from "fs";
import https from "https";
import { exec } from "child_process";
import filesUniteLegalService from "./files.uniteLegal.service";

jest.mock("child_process", () => ({
    exec: jest.fn((path, cb) => cb()),
}));

jest.mock("fs", () => ({
    createWriteStream: jest.fn(() => ({
        close: jest.fn(),
    })),
}));

const httpsPipeOnMock = jest.fn((_, cb) => cb());
const httpsPipeMock = jest.fn(() => ({
    on: httpsPipeOnMock,
}));

jest.mock("https", () => ({
    get: jest.fn((path, cb) =>
        cb({
            pipe: httpsPipeMock,
        }),
    ),
}));

describe("FilesUniteLegalService", () => {
    describe("DecompressHistoryUniteLegal", () => {
        it("should call exec with file path", async () => {
            const path = "Fake/path";

            await filesUniteLegalService.decompressHistoryUniteLegal(path);

            expect(exec).toHaveBeenCalledWith(`unzip ${path} -d ./output`, expect.any(Function));
        });

        it("should return uncompress file path", async () => {
            const path = "Fake/path";
            const expected = "./output/StockUniteLegaleHistorique_utf8.csv";

            const acutal = await filesUniteLegalService.decompressHistoryUniteLegal(path);

            expect(acutal).toBe(expected);
        });
    });

    describe("DownloadHistoryUniteLegal", () => {
        it("should call fs createWriteStream", async () => {
            await filesUniteLegalService.downloadHistoryUniteLegal();

            expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
        });

        it("should call https get", async () => {
            await filesUniteLegalService.downloadHistoryUniteLegal();

            expect(https.get).toHaveBeenCalledTimes(1);
        });

        it("should call file pipe", async () => {
            const file = { file: true, close: jest.fn() };
            (fs.createWriteStream as jest.Mock).mockReturnValueOnce(file);
            await filesUniteLegalService.downloadHistoryUniteLegal();

            expect(httpsPipeMock).toBeCalledWith(file);
        });

        it("should call file pipe on", async () => {
            await filesUniteLegalService.downloadHistoryUniteLegal();

            expect(httpsPipeOnMock).toBeCalledTimes(1);
        });

        it("should call file close", async () => {
            const file = { file: true, close: jest.fn() };
            (fs.createWriteStream as jest.Mock).mockReturnValueOnce(file);

            await filesUniteLegalService.downloadHistoryUniteLegal();

            expect(file.close).toBeCalledTimes(1);
        });

        it("should return dowloaded file", async () => {
            const expected = "StockUniteLegaleHistorique_utf8.zip";
            const actual = await filesUniteLegalService.downloadHistoryUniteLegal();

            expect(expected).toBe(actual);
        });
    });
});

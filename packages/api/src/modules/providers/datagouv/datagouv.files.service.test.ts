import fs from "fs";
import https from "https";
import { exec } from "child_process";
import datagouvFilesService from "./datagouv.files.service";

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
    describe("decompressArchive", () => {
        const PATH = "Fake/path";
        const OUT_PATH = "./output/out.csv";

        it("should call exec with file path", async () => {
            await datagouvFilesService.decompressArchive(PATH, OUT_PATH);
            expect(exec).toHaveBeenCalledWith(`unzip ${PATH} -d ./output`, expect.any(Function));
        });

        it("should return uncompress file path", async () => {
            const expected = OUT_PATH;
            const actual = await datagouvFilesService.decompressArchive(PATH, OUT_PATH);
            expect(actual).toBe(expected);
        });
    });

    describe("downloadFile", () => {
        const URL = "http://host.fr/archive.zip";
        const OUT_PATH = "file.zip";

        it("should call fs createWriteStream", async () => {
            await datagouvFilesService.downloadFile(URL, OUT_PATH);

            expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
        });

        it("should call https get", async () => {
            await datagouvFilesService.downloadFile(URL, OUT_PATH);

            expect(https.get).toHaveBeenCalledTimes(1);
        });

        it("should call file pipe", async () => {
            const file = { file: true, close: jest.fn() };
            (fs.createWriteStream as jest.Mock).mockReturnValueOnce(file);
            await datagouvFilesService.downloadFile(URL, OUT_PATH);

            expect(httpsPipeMock).toBeCalledWith(file);
        });

        it("should call file pipe on", async () => {
            await datagouvFilesService.downloadFile(URL, OUT_PATH);

            expect(httpsPipeOnMock).toBeCalledTimes(1);
        });

        it("should call file close", async () => {
            const file = { file: true, close: jest.fn() };
            (fs.createWriteStream as jest.Mock).mockReturnValueOnce(file);

            await datagouvFilesService.downloadFile(URL, OUT_PATH);

            expect(file.close).toBeCalledTimes(1);
        });

        it("should return downloaded file", async () => {
            const expected = OUT_PATH;
            const actual = await datagouvFilesService.downloadFile(URL, OUT_PATH);

            expect(expected).toBe(actual);
        });
    });
});

import fs from "fs";
import https from "https";
import { downloadFile } from "./FileHelper";

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

describe("downloadFile", () => {
    const URL = "http://host.fr/archive.zip";
    const OUT_PATH = "file.zip";

    it("should call fs createWriteStream", async () => {
        await downloadFile(URL, OUT_PATH);

        expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
    });

    it("should call https get", async () => {
        await downloadFile(URL, OUT_PATH);

        expect(https.get).toHaveBeenCalledTimes(1);
    });

    it("should call file pipe", async () => {
        const file = { file: true, close: jest.fn() };
        (fs.createWriteStream as jest.Mock).mockReturnValueOnce(file);
        await downloadFile(URL, OUT_PATH);

        expect(httpsPipeMock).toBeCalledWith(file);
    });

    it("should call file pipe on", async () => {
        await downloadFile(URL, OUT_PATH);

        expect(httpsPipeOnMock).toBeCalledTimes(1);
    });

    it("should call file close", async () => {
        const file = { file: true, close: jest.fn() };
        (fs.createWriteStream as jest.Mock).mockReturnValueOnce(file);

        await downloadFile(URL, OUT_PATH);

        expect(file.close).toBeCalledTimes(1);
    });

    it("should return downloaded file", async () => {
        const expected = OUT_PATH;
        const actual = await downloadFile(URL, OUT_PATH);

        expect(expected).toBe(actual);
    });
});

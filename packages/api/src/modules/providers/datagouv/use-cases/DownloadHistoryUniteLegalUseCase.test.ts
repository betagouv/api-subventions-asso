import fs from "fs";
import https from "https";

jest.mock("fs", () => ({
    createWriteStream: jest.fn(() => ({
        close: jest.fn()
    }))
}));

const httpsPipeOnMock = jest.fn((_, cb) => cb())
const httpsPipeMock = jest.fn(() => ({
    on: httpsPipeOnMock
}));

jest.mock("https", () => ({
    get: jest.fn((path, cb) => cb({
        pipe: httpsPipeMock
    }))
}));

import DownloadHistoryUniteLegalUseCase from "./DownloadHistoryUniteLegalUseCase";

describe("DownloadHistoryUniteLegalUseCase", () => {
    it('should call fs createWriteStream', async () => {
        await DownloadHistoryUniteLegalUseCase();

        expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
    })

    it('should call https get', async () => {
        await DownloadHistoryUniteLegalUseCase();

        expect(https.get).toHaveBeenCalledTimes(1);
    })

    it('should call file pipe', async () => {
        const file = { file: true, close: jest.fn() };
        (fs.createWriteStream as jest.Mock).mockReturnValueOnce(file)
        await DownloadHistoryUniteLegalUseCase();

        expect(httpsPipeMock).toBeCalledWith(file);
    })

    it('should call file pipe on', async () => {
        await DownloadHistoryUniteLegalUseCase();

        expect(httpsPipeOnMock).toBeCalledTimes(1);
    })

    it('should call file close', async () => {
        const file = { file: true, close: jest.fn() };
        (fs.createWriteStream as jest.Mock).mockReturnValueOnce(file)

        await DownloadHistoryUniteLegalUseCase();

        expect(file.close).toBeCalledTimes(1);
    })

    it('should return dowloaded file', async () => {
        const expected = "StockUniteLegaleHistorique_utf8.zip";
        const actual = await DownloadHistoryUniteLegalUseCase();

        expect(expected).toBe(actual);
    })
});
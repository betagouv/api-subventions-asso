import sireneStockUniteLegaleService from "./sirene-stock-unite-legale.service";
import { Readable } from "stream";
import fs from "fs";
import StreamZip from "node-stream-zip";
import SireneStockUniteLegaleParser from "./parser/sirene-stock-unite-legale.parser";
import sireneUniteLegaleService from "./sirene-unite-legale.service";
import { sireneStockUniteLegaleAdapter } from "../../../adapters/outputs/api/data-gouv/data-gouv.adapter";
import { ENV as _ENV } from "../../../configurations/env.conf";

jest.mock("node-stream-zip", () => {
    const mockExtract = jest.fn();
    const mockClose = jest.fn();

    return {
        async: jest.fn(() => ({
            extract: mockExtract,
            close: mockClose,
        })),
    };
});
jest.mock("./sirene-unite-legale.service");
jest.mock("../../../adapters/outputs/api/data-gouv/data-gouv.adapter");

const ZIP_PATH = "path/to/zip";
const DIRECTORY_PATH = "path/to/destination";
jest.mock("fs", () => {
    const actualFs = jest.requireActual("fs");
    return {
        ...actualFs,
        mkdtempSync: jest.fn(),
        createWriteStream: jest.fn(),
        existsSync: jest.fn(),
        rmSync: jest.fn(),
    };
});

describe("SireneStockUniteLegaleService", () => {
    describe("getOrCreateDirectory", () => {
        it("when directory_path is defined, check if the directory exists", () => {
            // @ts-expect-error: set private property
            sireneStockUniteLegaleService.directory_path = DIRECTORY_PATH;
            // @ts-expect-error : we are testing a private method
            sireneStockUniteLegaleService.getOrCreateDirectory();
            expect(fs.existsSync).toHaveBeenCalledWith(__dirname + "/" + DIRECTORY_PATH);
        });

        it("does not set directory_path if given folder does not exists", () => {
            // @ts-expect-error: set private property
            sireneStockUniteLegaleService.directory_path = DIRECTORY_PATH;
            jest.mocked(fs.existsSync).mockReturnValueOnce(true);
            // @ts-expect-error : we are testing a private method
            sireneStockUniteLegaleService.getOrCreateDirectory();
            expect(fs.mkdtempSync).not.toHaveBeenCalled();
        });

        it("when directo_path is undefined, create temporary folder", () => {
            // @ts-expect-error : we are testing a private method
            sireneStockUniteLegaleService.getOrCreateDirectory();
            expect(fs.mkdtempSync).toHaveBeenCalledWith(__dirname + "/tmpSirene");
        });

        it("should create a directory if it does not exist", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(false);
            // @ts-expect-error : we are testing a private method
            sireneStockUniteLegaleService.getOrCreateDirectory();
            expect(fs.mkdtempSync).toHaveBeenCalledWith(expect.stringContaining("/tmpSirene"));
        });
    });

    describe("getAndParse", () => {
        let getExtractAndSaveFilesMock: jest.SpyInstance;
        let deleteTemporaryFolderMock: jest.SpyInstance;
        beforeAll(() => {
            jest.spyOn(SireneStockUniteLegaleParser, "parseCsvAndInsert").mockResolvedValue();
            getExtractAndSaveFilesMock = jest
                .spyOn(sireneStockUniteLegaleService, "getExtractAndSaveFiles")
                .mockResolvedValue();
            deleteTemporaryFolderMock = jest
                .spyOn(sireneStockUniteLegaleService, "deleteTemporaryFolder")
                .mockReturnValue();
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should call getExtractAndSaveFiles", async () => {
            await sireneStockUniteLegaleService.getAndParse();
            expect(getExtractAndSaveFilesMock).toHaveBeenCalledTimes(1);
        });

        it("should call parseCsvAndInsert", async () => {
            await sireneStockUniteLegaleService.getAndParse();
            expect(sireneUniteLegaleService.parse).toHaveBeenCalledWith(
                // @ts-expect-error : private variable
                sireneStockUniteLegaleService.directory_path + "/StockUniteLegale_utf8.csv",
            );
        });

        it("should call deleteTemporaryFolder", async () => {
            await sireneStockUniteLegaleService.getAndParse();
            expect(deleteTemporaryFolderMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("getAndSaveZip", () => {
        let getFileMock: jest.SpyInstance;
        beforeAll(() => {
            getFileMock = jest.spyOn(sireneStockUniteLegaleAdapter, "getFileStream").mockResolvedValue({
                data: new Readable({
                    read() {
                        this.push("chunk1");
                        this.push("chunk2");
                        this.push(null);
                    },
                }),
                status: 200,
                statusText: "OK",
            });

            const mockFileStream = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, callback) => {
                    if (event === "finish") {
                        setImmediate(() => {
                            callback();
                        });
                    } else if (event === "error") {
                        setImmediate(() => {
                            callback(new Error("simulated error during writing"));
                        });
                    }
                }),
                emit: jest.fn(),

                removeListener: jest.fn(),
                listenerCount: jest.fn(),
                once: jest.fn(),
                close: jest.fn(),
            };

            (fs.createWriteStream as jest.Mock).mockReturnValue(mockFileStream);
        });

        afterAll(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        it("should call createWriteStream", async () => {
            await sireneStockUniteLegaleService.getAndSaveZip();
            expect(fs.createWriteStream).toHaveBeenCalledWith(expect.stringContaining("sirene-stock-unite-legale.zip"));
        });

        it("should call getFile", async () => {
            await sireneStockUniteLegaleService.getAndSaveZip();
            expect(sireneStockUniteLegaleAdapter.getFileStream).toHaveBeenCalledTimes(1);
        });

        it("should download and write the data to the file without errors", async () => {
            const acutal = await sireneStockUniteLegaleService.getAndSaveZip();
            expect(acutal).toBe("finish");
        });

        it("should throw an error if the response data emits an error", async () => {
            getFileMock.mockResolvedValueOnce({
                data: new Readable({
                    read() {
                        this.emit("error", new Error("simulated error during reading"));
                    },
                }),
                status: 300,
                statusText: "Not ok",
            });
            await expect(sireneStockUniteLegaleService.getAndSaveZip()).rejects.toThrow(
                "simulated error during reading",
            );
        });

        it("should throw an error if the file emits an error", async () => {
            const mockFileStream = {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn((event, callback) => {
                    if (event === "error") {
                        setImmediate(() => {
                            callback(new Error("simulated error during writing"));
                        });
                    }
                }),
                emit: jest.fn(),

                removeListener: jest.fn(),
                listenerCount: jest.fn(),
                once: jest.fn(),
                close: jest.fn(),
            };

            (fs.createWriteStream as jest.Mock).mockReturnValue(mockFileStream);

            await expect(sireneStockUniteLegaleService.getAndSaveZip()).rejects.toThrow(
                "simulated error during writing",
            );
        });
    });

    describe("decompressFolder", () => {
        it("should call StreamZip", async () => {
            await sireneStockUniteLegaleService.decompressFolder(ZIP_PATH, DIRECTORY_PATH);
            expect(StreamZip.async).toHaveBeenCalledWith({ file: ZIP_PATH });
        });

        it("should call extract", async () => {
            await sireneStockUniteLegaleService.decompressFolder(ZIP_PATH, DIRECTORY_PATH);
            expect(StreamZip.async).toHaveBeenCalledWith({ file: ZIP_PATH });
        });

        it("should call close", async () => {
            await sireneStockUniteLegaleService.decompressFolder(ZIP_PATH, DIRECTORY_PATH);
            expect(StreamZip.async).toHaveBeenCalledWith({ file: ZIP_PATH });
        });
    });

    describe("deleteTemporaryFolder", () => {
        it("should call fs.rmdirSync", () => {
            // @ts-expect-error: override ENV
            _ENV = "preprod";
            // @ts-expect-error : private variable
            sireneStockUniteLegaleService.directory_path = DIRECTORY_PATH;
            sireneStockUniteLegaleService.deleteTemporaryFolder();

            expect(fs.rmSync).toHaveBeenCalledWith(DIRECTORY_PATH, { recursive: true });
        });
    });
});

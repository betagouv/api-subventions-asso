import sireneStockUniteLegaleService from "./sirene-stock-unite-legale.service";
import { Readable } from "stream";
import fs from "fs";
import sireneUniteLegaleService from "./sirene-unite-legale.service";
import { sireneStockUniteLegaleAdapter } from "../../../adapters/outputs/api/data-gouv/data-gouv.adapter";

jest.mock("./sirene-unite-legale.service");
jest.mock("../../../adapters/outputs/api/data-gouv/data-gouv.adapter");

const DIRECTORY_PATH = "path/to/destination";
const PARQUET_FILE_NAME = "sirene-stock-unite-legale.parquet";

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
    beforeEach(() => {
        jest.clearAllMocks();
        // @ts-expect-error: set private property
        sireneStockUniteLegaleService.directory_path = undefined;
    });

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
        let getAndSaveFileMock: jest.SpyInstance;
        let deleteTemporaryFolderMock: jest.SpyInstance;
        beforeEach(() => {
            // @ts-expect-error: set private property
            sireneStockUniteLegaleService.directory_path = DIRECTORY_PATH;
            getAndSaveFileMock = jest.spyOn(sireneStockUniteLegaleService, "getAndSaveFile").mockResolvedValue();
            deleteTemporaryFolderMock = jest
                .spyOn(sireneStockUniteLegaleService, "deleteTemporaryFolder")
                .mockReturnValue();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should call getAndSaveFile", async () => {
            await sireneStockUniteLegaleService.getAndParse();
            expect(getAndSaveFileMock).toHaveBeenCalledTimes(1);
        });

        it("should parse downloaded parquet file", async () => {
            await sireneStockUniteLegaleService.getAndParse();
            expect(sireneUniteLegaleService.parse).toHaveBeenCalledWith(
                // @ts-expect-error : private variable
                sireneStockUniteLegaleService.directory_path + "/" + PARQUET_FILE_NAME,
            );
        });

        it("should call deleteTemporaryFolder", async () => {
            await sireneStockUniteLegaleService.getAndParse();
            expect(deleteTemporaryFolderMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("getAndSaveParquet", () => {
        let getFileMock: jest.SpyInstance;
        beforeEach(() => {
            // @ts-expect-error: set private property
            sireneStockUniteLegaleService.directory_path = DIRECTORY_PATH;
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

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should call createWriteStream", async () => {
            await sireneStockUniteLegaleService.getAndSaveParquet();
            expect(fs.createWriteStream).toHaveBeenCalledWith(expect.stringContaining(PARQUET_FILE_NAME));
        });

        it("should call getFile", async () => {
            await sireneStockUniteLegaleService.getAndSaveParquet();
            expect(sireneStockUniteLegaleAdapter.getFileStream).toHaveBeenCalledTimes(1);
        });

        it("should download and write the data to the file without errors", async () => {
            const actual = await sireneStockUniteLegaleService.getAndSaveParquet();
            expect(actual).toBe("finish");
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
            await expect(sireneStockUniteLegaleService.getAndSaveParquet()).rejects.toThrow(
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

            await expect(sireneStockUniteLegaleService.getAndSaveParquet()).rejects.toThrow(
                "simulated error during writing",
            );
        });
    });

    describe("deleteTemporaryFolder", () => {
        it("should call fs.rmdirSync", () => {
            // @ts-expect-error : private variable
            sireneStockUniteLegaleService.directory_path = DIRECTORY_PATH;
            sireneStockUniteLegaleService.deleteTemporaryFolder();

            expect(fs.rmSync).toHaveBeenCalledWith(DIRECTORY_PATH, { recursive: true });
        });
    });
});

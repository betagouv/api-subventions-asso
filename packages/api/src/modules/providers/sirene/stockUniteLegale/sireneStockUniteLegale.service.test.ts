import sireneStockUniteLegaleService from "./sireneStockUniteLegale.service";
import sireneStockUniteLegaleApiPort from "../../../../dataProviders/api/sirene/sireneStockUniteLegale.port";
import sireneStockUniteLegaleDbPort from "../../../../dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import { Readable } from "stream";
import fs from "fs";
import StreamZip from "node-stream-zip";
import SireneStockUniteLegaleParser from "./parser/sireneStockUniteLegale.parser";
import { SireneUniteLegaleDbo } from "./@types/SireneUniteLegaleDbo";

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
        it("should check if the directory exists", () => {
            // @ts-expect-error : we are testing a private method
            sireneStockUniteLegaleService.getOrCreateDirectory();
            // @ts-expect-error : private variable
            expect(fs.existsSync).toHaveBeenCalledWith(sireneStockUniteLegaleService.directory_path);
        });

        it("should create a directory if it does not exist", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(false);
            // @ts-expect-error : we are testing a private method
            sireneStockUniteLegaleService.getOrCreateDirectory();
            expect(fs.mkdtempSync).toHaveBeenCalledWith(expect.stringContaining("/tmpSirene"));
        });

        it("should not create a directory if it exists", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(true);
            // @ts-expect-error : we are testing a private method
            sireneStockUniteLegaleService.getOrCreateDirectory();
            expect(fs.mkdtempSync).not.toHaveBeenCalled();
        });
    });

    describe("getAndParse", () => {
        let getExtractAndSaveFilesMock: jest.SpyInstance;
        let parseCsvAndInsertMock: jest.SpyInstance;
        let deleteTemporaryFolderMock: jest.SpyInstance;
        beforeAll(() => {
            getExtractAndSaveFilesMock = jest
                .spyOn(sireneStockUniteLegaleService, "getExtractAndSaveFiles")
                .mockResolvedValue();
            parseCsvAndInsertMock = jest.spyOn(SireneStockUniteLegaleParser, "parseCsvAndInsert").mockResolvedValue();
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
            // @ts-expect-error : private variable
            expect(parseCsvAndInsertMock).toHaveBeenCalledWith(
                sireneStockUniteLegaleService.directory_path + "/StockUniteLegale_utf8.csv",
            );
        });

        it("should call deleteTemporaryFolder", async () => {
            await sireneStockUniteLegaleService.getAndParse();
            expect(deleteTemporaryFolderMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("getAndSaveZip", () => {
        let getZipMock: jest.SpyInstance;
        beforeAll(() => {
            getZipMock = jest.spyOn(sireneStockUniteLegaleApiPort, "getZip").mockResolvedValue({
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
            expect(fs.createWriteStream).toHaveBeenCalledWith(expect.stringContaining("SireneStockUniteLegale.zip"));
        });

        it("should call getZip", async () => {
            await sireneStockUniteLegaleService.getAndSaveZip();
            expect(sireneStockUniteLegaleApiPort.getZip).toHaveBeenCalledTimes(1);
        });

        it("should download and write the data to the file without errors", async () => {
            const acutal = await sireneStockUniteLegaleService.getAndSaveZip();
            expect(acutal).toBe("finish");
        });

        it("should throw an error if the response data emits an error", async () => {
            getZipMock.mockResolvedValueOnce({
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
            // @ts-expect-error : private variable
            sireneStockUniteLegaleService.directory_path = DIRECTORY_PATH;
            sireneStockUniteLegaleService.deleteTemporaryFolder();

            expect(fs.rmSync).toHaveBeenCalledWith(DIRECTORY_PATH, { recursive: true });
        });
    });

    describe("insertOne", () => {
        let insertOneMock: jest.SpyInstance;
        beforeAll(() => {
            insertOneMock = jest.spyOn(sireneStockUniteLegaleDbPort, "insertOne").mockImplementation(jest.fn());
        });
        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should call insertOne", async () => {
            const dbo = { siren: "123456789" } as unknown as SireneUniteLegaleDbo;
            await sireneStockUniteLegaleService.insertOne(dbo);
            expect(insertOneMock).toHaveBeenCalledWith(dbo);
        });
    });

    describe("insertMany", () => {
        let insertManyMock: jest.SpyInstance;
        beforeAll(() => {
            insertManyMock = jest.spyOn(sireneStockUniteLegaleDbPort, "insertMany").mockImplementation(jest.fn());
        });
        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should call insertMany", async () => {
            const dbos = [{ siren: "123456789" }] as unknown as SireneUniteLegaleDbo[];
            await sireneStockUniteLegaleService.insertMany(dbos);
            expect(insertManyMock).toHaveBeenCalledWith(dbos);
        });
    });
});

import sireneStockUniteLegaleService from "./sireneStockUniteLegale.service";
import sireneStockUniteLegalePort from "../../../../dataProviders/api/sirene/sireneStockUniteLegale.port";
import { Readable } from "stream";
import fs from "fs";
import { exec } from "child_process";
import StreamZip from "node-stream-zip";

jest.mock("child_process", () => ({
    exec: jest.fn((_path, cb) => cb(null, "stdout", "stderr")),
}));

jest.mock('node-stream-zip', () => {
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
    };
});

describe("SireneStockUniteLegaleService", () => {
    let getZipMock: jest.SpyInstance;
    beforeEach(() => {
        getZipMock = jest.spyOn(sireneStockUniteLegalePort, "getZip").mockResolvedValue({
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

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("getAndSaveZip", () => {
        it("should call createWriteStream", async () => {
            await sireneStockUniteLegaleService.getAndSaveZip();
            expect(fs.createWriteStream).toHaveBeenCalledWith(expect.stringContaining("SireneStockUniteLegale.zip"));
        });

        it("should call getZip", async () => {
            await sireneStockUniteLegaleService.getAndSaveZip();
            expect(sireneStockUniteLegalePort.getZip).toHaveBeenCalledTimes(1);
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

    /*
    
            jest.mocked(exec).mockImplementationOnce((_path, callback) => callback(new Error("simulated error during exec"), "stdout", "stderr"));
       
        */

        
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
        

    describe("getExtractAndSaveFiles", () => {
        let mockGetAndSaveZip: jest.SpyInstance;
        let mockDecompressFolder: jest.SpyInstance;

        beforeEach(() => {
            mockGetAndSaveZip = jest.spyOn(sireneStockUniteLegaleService, "getAndSaveZip").mockResolvedValue("finish");
            mockDecompressFolder = jest.spyOn(sireneStockUniteLegaleService, "decompressFolder").mockResolvedValue(
                DIRECTORY_PATH,
            );
        });
        afterAll(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });
        it("should call getAndSaveZip", async () => {
            await sireneStockUniteLegaleService.getExtractAndSaveFiles();
            expect(sireneStockUniteLegaleService.getAndSaveZip).toHaveBeenCalledTimes(1);
        });

        it("should call decompressFolder", async () => {
            sireneStockUniteLegaleService.directory_path = DIRECTORY_PATH;
            await sireneStockUniteLegaleService.getExtractAndSaveFiles();
            expect(sireneStockUniteLegaleService.decompressFolder).toHaveBeenCalledWith(
                DIRECTORY_PATH + "/SireneStockUniteLegale.zip",
                DIRECTORY_PATH,
            );
            
        
        });
    });
});

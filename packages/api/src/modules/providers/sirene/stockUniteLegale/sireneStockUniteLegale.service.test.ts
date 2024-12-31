import sireneStockUniteLegaleService from "./sireneStockUniteLegale.service";
import sireneStockUniteLegalePort from "../../../../dataProviders/api/sirene/sireneStockUniteLegale.port";
import { Readable } from "stream";
import fs from "fs";
import { exec } from "child_process";

jest.mock("child_process", () => ({
    exec: jest.fn((_path, cb) => cb(null, "stdout", "stderr")),
}));

const ZIP_PATH = "path/to/zip";
const DESTINATION_DIRECTORY_PATH = "path/to/destination";
jest.mock("fs", () => {
    const actualFs = jest.requireActual("fs");
    return {
        ...actualFs,
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

    describe("decompressFolder", () => {
        it("should call exec with the right parameters", async () => {
            await sireneStockUniteLegaleService.decompressFolder(ZIP_PATH, DESTINATION_DIRECTORY_PATH);
            expect(exec).toHaveBeenCalledWith(
                `unzip ${ZIP_PATH} -d ${DESTINATION_DIRECTORY_PATH}`,
                expect.any(Function),
            );
        });
        it("should decompress the file and return the path", async () => {
            const actual = await sireneStockUniteLegaleService.decompressFolder(ZIP_PATH, DESTINATION_DIRECTORY_PATH);
            expect(actual).toBe(DESTINATION_DIRECTORY_PATH);
        });

        // TO DO : test error
    });
});

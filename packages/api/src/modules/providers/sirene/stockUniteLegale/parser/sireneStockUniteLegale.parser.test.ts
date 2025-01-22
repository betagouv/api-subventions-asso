import SireneStockUniteLegaleParser from "./sireneStockUniteLegale.parser";
import fs, { createReadStream, ReadStream } from "fs";
import { parse } from "csv-parse";
import { DTOS, DBOS, ENTITIES } from "../../__fixtures__/sireneStockUniteLegale.fixture";
import SireneStockUniteLegaleAdapter from "../adapter/sireneStockUniteLegale.adapter";
import sireneStockUniteLegaleService from "../sireneStockUniteLegale.service";

jest.mock("fs", () => {
    const actualFs = jest.requireActual("fs");
    return {
        ...actualFs,
        existsSync: jest.fn().mockReturnValue(true),
        createReadStream: jest.fn(),
    };
});

jest.mock("csv-parse");

const NUMBER_DTOS_BEING_ASSOCIATIONS = 2;

describe("SireneStockUniteLegaleParser", () => {
    describe("filePathValidator", () => {
        it("should throw an error if file is not provided", () => {
            expect(() => SireneStockUniteLegaleParser.filePathValidator("")).toThrowError(
                "Parse command need file args",
            );
        });
        it("should call fs.existsSync if a filePath is given", () => {
            const filePath = "file";
            SireneStockUniteLegaleParser.filePathValidator(filePath);
            expect(fs.existsSync).toHaveBeenCalledWith(filePath);
        });

        it("should throw an error if file does not exist", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(false);
            expect(() => SireneStockUniteLegaleParser.filePathValidator("file")).toThrowError("File not found file");
        });

        it("should return true if file exists", () => {
            expect(SireneStockUniteLegaleParser.filePathValidator("file")).toBe(true);
        });
    });

    describe("parseCsvAndInsert", () => {
        let mockFilePathValidator: jest.SpyInstance;
        let mockDtoToEntity: jest.SpyInstance;
        let mockEntityToDbo: jest.SpyInstance;
        let mockIsToInclude: jest.SpyInstance;
        let mockInsertMany: jest.SpyInstance;
        let filePath = "file";
        let mockStream: ReadStream;
        beforeAll(() => {
            jest.useFakeTimers();
            mockFilePathValidator = jest.spyOn(SireneStockUniteLegaleParser, "filePathValidator").mockReturnValue(true);
            mockDtoToEntity = jest.spyOn(SireneStockUniteLegaleAdapter, "dtoToEntity").mockReturnValue(ENTITIES[0]);
            mockEntityToDbo = jest.spyOn(SireneStockUniteLegaleAdapter, "entityToDbo").mockReturnValue(DBOS[0]);
            mockInsertMany = jest.spyOn(sireneStockUniteLegaleService, "insertMany").mockImplementation(jest.fn());
            mockStream = {
                pipe: jest.fn().mockReturnThis(),
                on: jest.fn().mockImplementation((event, cb) => {
                    if (event === "data") {
                        cb(DTOS[0]);
                        cb(DTOS[1]);
                        cb(DTOS[2]);
                    }
                    if (event === "end") {
                        cb();
                    }
                    return mockStream;
                }),
                pause: jest.fn(),
                resume: jest.fn(),
                error: jest.fn(),
            } as unknown as ReadStream;
            jest.mocked(createReadStream).mockReturnValue(mockStream);
        });

        beforeEach(() => {
            mockIsToInclude = jest.spyOn(SireneStockUniteLegaleParser, "isToInclude").mockImplementation(() => {
                if (mockIsToInclude.mock.calls.length <= 2) {
                    return true;
                }
                return false;
            });
        });

        afterAll(() => {
            jest.useRealTimers();
            jest.restoreAllMocks();
        });

        it("should call filePathValidator", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockFilePathValidator).toHaveBeenCalledWith(filePath);
        });

        it("should call fs.createReadStream with the filePath", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
        });

        it("should call parse", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(parse).toHaveBeenCalledTimes(1);
        });

        it("should call isToInclude", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockIsToInclude).toHaveBeenCalledTimes(DTOS.length);
        });

        it("should call sireneStockUniteLegaleService.insertMany once", async () => {
            // 1 is equal to the number of batches + 1 computes as Math.floor(NUMBER_DTOS_BEING_ASSOCIATIONS / 1000) + 1
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockInsertMany).toHaveBeenCalledTimes(1);
        });

        it("should call entityToDbo", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockEntityToDbo).toHaveBeenCalledTimes(NUMBER_DTOS_BEING_ASSOCIATIONS);
        });

        it("should call dtoToEntity", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockDtoToEntity).toHaveBeenCalledTimes(NUMBER_DTOS_BEING_ASSOCIATIONS);
        });
        it("should call stream.pause", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockStream.pause).toHaveBeenCalledTimes(NUMBER_DTOS_BEING_ASSOCIATIONS);
        });

        it("should call stream.resume", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockStream.resume).toHaveBeenCalledTimes(NUMBER_DTOS_BEING_ASSOCIATIONS);
        });

        it("should return undefined if no error occurs", async () => {
            const result = await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(result).toBe(undefined);
        });

        it("should throw an error if an error occurs", async () => {
            mockStream.on = jest.fn().mockImplementation((event, cb) => {
                if (event === "error") {
                    cb(new Error("error"));
                }
                return mockStream;
            });
            const result = SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            await expect(result).rejects.toThrowError("error");
        });
    });

    describe("isToInclude", () => {
        // data are to be added if belong to the LEGAL CATEFORIES ACCEPTED and if the attribute purge is ""
        // belong DTOS[0] respect the condition and DTOS[2] does not

        it("should return true if the data is to include", () => {
            const actual = SireneStockUniteLegaleParser.isToInclude(DTOS[0]);
            const expected = true;
            expect(actual).toBe(expected);
        });

        it("should return false if the data is not to include", () => {
            const actual = SireneStockUniteLegaleParser.isToInclude(DTOS[2]);
            const expected = false;
            expect(actual).toBe(expected);
        });
    });
});

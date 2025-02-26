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
jest.mock("../adapter/sireneStockUniteLegale.adapter");
jest.mock("../sireneStockUniteLegale.service");
jest.mock("../../../uniteLegalEntreprises/uniteLegal.entreprises.service");
jest.mock("../../../../../entities/UniteLegalEntrepriseEntity");

const NUMBER_DTOS_BEING_ASSOCIATIONS = 2;
const NUMBER_DTOS_TO_SAVE = 3;

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
        let mockIsAsso: jest.SpyInstance;
        let mockIsCorrect: jest.SpyInstance;
        let filePath = "file";
        let mockStream: ReadStream;
        beforeAll(() => {
            mockFilePathValidator = jest.spyOn(SireneStockUniteLegaleParser, "filePathValidator").mockReturnValue(true);
            jest.mocked(SireneStockUniteLegaleAdapter.dtoToEntity).mockReturnValue(ENTITIES[0]);
            jest.mocked(SireneStockUniteLegaleAdapter.entityToDbo).mockReturnValue(DBOS[0]);
            jest.mocked(sireneStockUniteLegaleService.insertMany).mockImplementation(jest.fn());
            mockStream = {
                pipe: jest.fn().mockReturnThis(),
                on: jest.fn().mockImplementation((event, cb) => {
                    if (event === "data") {
                        cb(DTOS[0]);
                        cb(DTOS[1]);
                        cb(DTOS[2]);
                        cb(DTOS[3]);
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
            mockIsAsso = jest.spyOn(SireneStockUniteLegaleParser, "isAsso");
            mockIsCorrect = jest.spyOn(SireneStockUniteLegaleParser, "isCorrect");
        });

        beforeEach(() => {
            mockIsAsso = jest
                .spyOn(SireneStockUniteLegaleParser, "isAsso")
                .mockImplementation(() => mockIsAsso.mock.calls.length <= 2);
            mockIsCorrect = jest
                .spyOn(SireneStockUniteLegaleParser, "isCorrect")
                .mockImplementation(() => mockIsCorrect.mock.calls.length <= 3);
        });

        afterEach(() => {
            mockIsAsso.mockRestore();
            mockIsCorrect.mockRestore();
        });

        afterAll(() => {
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

        it("should call isCorrect", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockIsCorrect).toHaveBeenCalledTimes(DTOS.length);
        });

        it("should call isAsso", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockIsAsso).toHaveBeenCalledTimes(DTOS.length - 1); // one is not correct
        });

        it("should call sireneStockUniteLegaleService.insertMany once", async () => {
            // 1 is equal to the number of batches + 1 computes as Math.floor(NUMBER_DTOS_BEING_ASSOCIATIONS / 1000) + 1
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(sireneStockUniteLegaleService.insertMany).toHaveBeenCalledTimes(1);
        });

        it("should call entityToDbo to save asso", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(SireneStockUniteLegaleAdapter.entityToDbo).toHaveBeenCalledTimes(NUMBER_DTOS_BEING_ASSOCIATIONS);
        });

        it("should call dtoToEntity", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(SireneStockUniteLegaleAdapter.dtoToEntity).toHaveBeenCalledTimes(NUMBER_DTOS_BEING_ASSOCIATIONS);
        });

        it("should call stream.pause", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockStream.pause).toHaveBeenCalledTimes(NUMBER_DTOS_TO_SAVE);
        });

        it("should call stream.resume", async () => {
            await SireneStockUniteLegaleParser.parseCsvAndInsert(filePath);
            expect(mockStream.resume).toHaveBeenCalledTimes(NUMBER_DTOS_TO_SAVE);
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

    describe("isCorrect", () => {
        // data is correct if it has not been purged. DTOS[3] is purged and DTOS[0] is not

        it("should return true if the data is to include", () => {
            const actual = SireneStockUniteLegaleParser.isCorrect(DTOS[0]);
            const expected = true;
            expect(actual).toBe(expected);
        });

        it("should return false if the data is not to include", () => {
            const actual = SireneStockUniteLegaleParser.isCorrect(DTOS[3]);
            const expected = false;
            expect(actual).toBe(expected);
        });
    });

    describe("isAsso", () => {
        // data is considered asso according to LEGAL CATEFORIES ACCEPTED
        // belong DTOS[0] respect the condition and DTOS[2] does not

        it("should return true if the data is to include", () => {
            const actual = SireneStockUniteLegaleParser.isAsso(DTOS[0]);
            const expected = true;
            expect(actual).toBe(expected);
        });

        it("should return false if the data is not to include", () => {
            const actual = SireneStockUniteLegaleParser.isAsso(DTOS[2]);
            const expected = false;
            expect(actual).toBe(expected);
        });
    });
});

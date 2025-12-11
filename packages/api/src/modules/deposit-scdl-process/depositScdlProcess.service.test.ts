import {
    CREATE_DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_ENTITY,
    DEPOSIT_LOG_ENTITY_STEP_2,
    DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
    UPLOADED_FILE_INFOS_ENTITY,
} from "./__fixtures__/depositLog.fixture";
import depositScdlProcessService from "./depositScdlProcess.service";
import DepositScdlLogEntity from "./entities/depositScdlLog.entity";
import { BadRequestError, ConflictError, NotFoundError } from "core";
import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import DepositScdlLogDtoAdapter from "./depositScdlLog.dto.adapter";
import scdlService from "../providers/scdl/scdl.service";
import { ScdlStorableGrant } from "../providers/scdl/@types/ScdlStorableGrant";
import { MixedParsedError } from "../providers/scdl/@types/Validation";
import UploadedFileInfosEntity from "./entities/uploadedFileInfos.entity";
import * as FileHelper from "../../shared/helpers/FileHelper";
import { ScdlParsedInfos } from "../providers/scdl/@types/ScdlParsedInfos";
import MiscScdlGrantEntity from "../providers/scdl/entities/MiscScdlGrantEntity";
import MiscScdlGrant from "../providers/scdl/__fixtures__/MiscScdlGrant";
import depositScdlProcessCheckService from "./check/DepositScdlProcess.check.service";
import MiscScdlProducerEntity from "../providers/scdl/entities/MiscScdlProducerEntity";
import Siret from "../../identifierObjects/Siret";
import dataLogService from "../data-log/dataLog.service";
import { DataLogEntity } from "../data-log/entities/dataLogEntity";
import { InsertOneResult } from "mongodb";
import s3FileService from "../s3-file/s3Storage.service";
import { DefaultObject } from "../../@types";

jest.mock("./check/DepositScdlProcess.check.service");
jest.mock("../../dataProviders/db/deposit-log/depositLog.port");
jest.mock("../../dataProviders/db/deposit-log/DepositLog.adapter");
jest.mock("../providers/scdl/scdl.service.ts");

describe("DepositScdlProcessService", () => {
    let mockGetDepositLog: jest.SpyInstance<Promise<DepositScdlLogEntity | null>, [string]>;
    let mockFindDepositLog: jest.SpyInstance<
        Promise<DepositScdlLogEntity[]>,
        [query?: DefaultObject<unknown> | undefined]
    >;
    let mockDeleteDepositLog: jest.SpyInstance<Promise<boolean>, [string]>;
    let mockS3DeleteUserFile: jest.SpyInstance<Promise<void>, [userId: string, fileName: string]>;
    let mockGetUserFile: jest.SpyInstance<Promise<Express.Multer.File>, [userId: string, fileName: string]>;
    let mockS3uploadAndReplaceUserFile: jest.SpyInstance<Promise<string>, [file: Express.Multer.File, userId: string]>;
    let mockParseCsv: jest.SpyInstance<
        { entities: ScdlStorableGrant[]; errors: MixedParsedError[]; parsedInfos: ScdlParsedInfos },
        [fileContent: Buffer<ArrayBufferLike>, delimiter?: string | undefined, quote?: string | boolean | undefined]
    >;
    let mockGetGrantsOnPeriodByAllocator: jest.SpyInstance<
        Promise<MiscScdlGrantEntity[]>,
        [allocatorSiret: string, exercices: number[]]
    >;
    let mockParseXls: jest.SpyInstance<
        { entities: ScdlStorableGrant[]; errors: MixedParsedError[]; parsedInfos: ScdlParsedInfos },
        [fileContent: Buffer<ArrayBufferLike>, pageName?: string | undefined, rowOffset?: number | undefined]
    >;
    let mockDetectCsvDelimiter: jest.SpyInstance<string, [fileContent: Buffer<ArrayBufferLike>]>;

    const USER_ID = "userId";

    const createMockFile = (originalname: string, buffer: Buffer = Buffer.from("test")): Express.Multer.File => ({
        fieldname: "file",
        originalname,
        encoding: "7bit",
        mimetype: "text/csv",
        buffer,
        size: buffer.length,
        destination: "",
        filename: "",
        path: "",
        stream: {} as never,
    });

    beforeEach(() => {
        mockGetDepositLog = jest.spyOn(depositScdlProcessService, "getDepositLog");
        mockFindDepositLog = jest.spyOn(depositScdlProcessService, "find");
        mockGetGrantsOnPeriodByAllocator = jest.spyOn(scdlService, "getGrantsOnPeriodByAllocator");
        mockDeleteDepositLog = jest.spyOn(depositLogPort, "deleteByUserId");
        mockS3DeleteUserFile = jest.spyOn(s3FileService, "deleteUserFile");
        mockGetUserFile = jest.spyOn(s3FileService, "getUserFile");
        mockS3uploadAndReplaceUserFile = jest.spyOn(s3FileService, "uploadAndReplaceUserFile");
        mockParseCsv = jest.spyOn(scdlService, "parseCsv");
        mockParseXls = jest.spyOn(scdlService, "parseXls");
        mockDetectCsvDelimiter = jest.spyOn(FileHelper, "detectCsvDelimiter");
    });

    describe("getDepositLog", () => {
        it("Should return a DepositLog", async () => {
            const expected = DEPOSIT_LOG_ENTITY;

            mockGetDepositLog.mockResolvedValueOnce(expected);

            const actual = await depositScdlProcessService.getDepositLog(USER_ID);

            expect(expected).toEqual(actual);
        });

        it("should call getDepositLog with userId", async () => {
            mockGetDepositLog.mockResolvedValueOnce(null);

            await depositScdlProcessService.getDepositLog(USER_ID);

            expect(mockGetDepositLog).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe("generateExistingGrantsCsv", () => {
        it("Should return csv with filename", async () => {
            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([MiscScdlGrant]);

            const mockDate = new Date("2025-11-04T10:30:00Z");
            jest.spyOn(global, "Date").mockImplementation(() => mockDate as never);

            const actual = await depositScdlProcessService.generateExistingGrantsCsv(USER_ID);

            expect(actual.csv).toBe(
                '"allocatorName","allocatorSiret","exercice","amount","associationSiret","associationName","associationRna","object","conventionDate","decisionReference","paymentNature","paymentConditions","paymentStartDate","paymentEndDate","idRAE","UeNotification","grantPercentage","aidSystem"\n' +
                    '"Région Bretagne","23350001600040","2023","47800.2","38047555800058","Association Les Petits Débrouillards Bretagne","W123456789","Animations climat-énergie dans les lycées de la région","""2017-06-27T00:00:00.000Z""","2017-03-103","aide en numéraire","unique","""2017-03-14T00:00:00.000Z""","""2018-03-14T00:00:00.000Z""","12345","1","0.5","65d5b6c7-102c-4440-ac3b-768f708edc0a"\n',
            );
            expect(actual.fileName).toBe("existing-grants-12345678901234-2021-2022-20251104.csv");
        });

        it("Should throw NotFoundError when no depositLog", async () => {
            mockGetDepositLog.mockResolvedValueOnce(null);

            await expect(depositScdlProcessService.generateExistingGrantsCsv(USER_ID)).rejects.toThrow(NotFoundError);
        });

        it("Should throw NotFoundError when wrong uploadedFileInfos", async () => {
            const uploadedFileInfosWithMultipleAllocatorsSiret = {
                ...UPLOADED_FILE_INFOS_ENTITY,
                allocatorsSiret: [...UPLOADED_FILE_INFOS_ENTITY.allocatorsSiret, "98765432101234"],
            };

            const depositLogWithMultipleAllocatorSiret = {
                ...DEPOSIT_LOG_ENTITY_STEP_2,
                uploadedFileInfos: uploadedFileInfosWithMultipleAllocatorsSiret,
            };
            mockGetDepositLog.mockResolvedValueOnce(depositLogWithMultipleAllocatorSiret);

            await expect(depositScdlProcessService.generateExistingGrantsCsv(USER_ID)).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteDepositLog", () => {
        it("Should return an empty promise", async () => {
            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            mockDeleteDepositLog.mockResolvedValueOnce(true);
            mockS3DeleteUserFile.mockResolvedValueOnce();

            expect(await depositScdlProcessService.deleteDepositLog(USER_ID)).toBeUndefined();
        });

        it("should call deleteByUserId with userId", async () => {
            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            mockDeleteDepositLog.mockResolvedValueOnce(true);
            mockS3DeleteUserFile.mockResolvedValueOnce();

            await depositScdlProcessService.deleteDepositLog(USER_ID);

            expect(mockDeleteDepositLog).toHaveBeenCalledWith(USER_ID);
        });

        it("should call deleteUserFile when deposit log exists", async () => {
            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            mockDeleteDepositLog.mockResolvedValueOnce(true);
            mockS3DeleteUserFile.mockResolvedValueOnce();

            await depositScdlProcessService.deleteDepositLog(USER_ID);

            expect(mockS3DeleteUserFile).toHaveBeenCalledWith(
                USER_ID,
                DEPOSIT_LOG_ENTITY_STEP_2.uploadedFileInfos!.fileName,
            );
        });

        it("should not call deleteUserFile when no deposit log", async () => {
            mockGetDepositLog.mockResolvedValueOnce(null);
            mockDeleteDepositLog.mockResolvedValueOnce(true);
            mockS3DeleteUserFile.mockResolvedValueOnce();

            await depositScdlProcessService.deleteDepositLog(USER_ID);

            expect(mockS3DeleteUserFile).not.toHaveBeenCalled();
        });
    });

    describe("createDepositLog", () => {
        it("Should return a DepositLog", async () => {
            mockGetDepositLog.mockResolvedValueOnce(null);

            const expected: DepositScdlLogEntity = {
                userId: USER_ID,
                step: 1,
                overwriteAlert: true,
                updateDate: new Date(),
            };

            jest.spyOn(DepositScdlLogDtoAdapter, "createDepositScdlLogDtoToEntity").mockReturnValue(expected);
            const actual = await depositScdlProcessService.createDepositLog(CREATE_DEPOSIT_LOG_DTO, USER_ID);

            expect(actual).toMatchObject(expected);
        });

        it("Should throw ConflictError when deposit log already exists", async () => {
            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY);

            await expect(
                depositScdlProcessService.createDepositLog(CREATE_DEPOSIT_LOG_DTO, USER_ID),
            ).rejects.toBeInstanceOf(ConflictError);
        });
    });

    describe("updateDepositLog", () => {
        it("Should return a DepositLog", async () => {
            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY);
            const step = 3;
            const expected = {
                userId: USER_ID,
                step: step,
                overwriteAlert: true,
                updateDate: new Date(),
            };

            const mockUpdatePartial = jest.spyOn(depositLogPort, "updatePartial").mockResolvedValue(expected);

            const actual = await depositScdlProcessService.updateDepositLog(
                step,
                DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
                USER_ID,
            );

            expect(mockUpdatePartial).toHaveBeenCalledWith({
                step,
                userId: USER_ID,
                ...DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
            });

            expect(actual).toMatchObject(expected);
        });

        it("Should throw NotFoundError when Deposit log not found", async () => {
            mockGetDepositLog.mockResolvedValueOnce(null);

            await expect(
                depositScdlProcessService.updateDepositLog(2, CREATE_DEPOSIT_LOG_DTO, USER_ID),
            ).rejects.toBeInstanceOf(NotFoundError);
        });
    });

    describe("validateScdlFile", () => {
        it("Should return deposit log with correct informations", async () => {
            const mockDate = new Date("2025-11-04T10:30:00Z");
            jest.spyOn(global, "Date").mockImplementation(() => mockDate as never);
            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY);
            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([
                {} as MiscScdlGrantEntity,
                {} as MiscScdlGrantEntity,
            ]);
            mockS3uploadAndReplaceUserFile.mockResolvedValue("userFileId");
            const step = 2;

            const expected: DepositScdlLogEntity = {
                userId: USER_ID,
                step: step,
                overwriteAlert: true,
                updateDate: new Date(),
                allocatorSiret: "12345678901234",
            };

            const file = createMockFile("test.csv");
            const parsedResult = {
                entities: [],
                errors: [],
                parsedInfos: {
                    allocatorsSiret: ["12345678901234"],
                    grantCoverageYears: [2025],
                    parseableLines: 0,
                    totalLines: 0,
                    existingLinesInDbOnSamePeriod: 0,
                } as ScdlParsedInfos,
            };

            mockParseCsv.mockReturnValueOnce(parsedResult);
            const mockUpdatePartial = jest.spyOn(depositLogPort, "updatePartial").mockResolvedValue(expected);

            const actual = await depositScdlProcessService.validateScdlFile(
                file,
                DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
                USER_ID,
            );

            expect(mockUpdatePartial).toHaveBeenCalledWith(
                expect.objectContaining({
                    step: 2,
                    userId: "userId",
                    permissionAlert: true,
                    uploadedFileInfos: expect.any(UploadedFileInfosEntity),
                }),
            );

            const actualCall = mockUpdatePartial.mock.calls[0][0];
            expect(actualCall.uploadedFileInfos).toMatchObject({
                fileName: "test.csv",
                uploadDate: mockDate,
                allocatorsSiret: ["12345678901234"],
                errors: [],
            });

            expect(actual).toMatchObject(expected);
        });
    });

    describe("parseFile", () => {
        it("should parse CSV file with detected delimiter", () => {
            const file = createMockFile("test.csv");
            const expectedDelimiter = ";";
            const expectedResult = { entities: [], errors: [], parsedInfos: {} as ScdlParsedInfos };

            mockDetectCsvDelimiter.mockReturnValue(expectedDelimiter);
            mockParseCsv.mockReturnValue(expectedResult);

            // @ts-expect-error - test private method
            const result = depositScdlProcessService.parseFile(file, undefined);

            expect(mockDetectCsvDelimiter).toHaveBeenCalledWith(file.buffer);
            expect(mockParseCsv).toHaveBeenCalledWith(file.buffer, expectedDelimiter);
            expect(mockParseXls).not.toHaveBeenCalled();
            expect(result).toBe(expectedResult);
        });

        it("should parse Excel file with pageName", () => {
            const file = createMockFile("test.xlsx");
            const pageName = "Sheet1";
            const expectedResult = { entities: [], errors: [], parsedInfos: {} as ScdlParsedInfos };

            mockParseXls.mockReturnValue(expectedResult);

            // @ts-expect-error - test private method
            const result = depositScdlProcessService.parseFile(file, pageName);

            expect(mockParseXls).toHaveBeenCalledWith(file.buffer, pageName);
            expect(mockDetectCsvDelimiter).not.toHaveBeenCalled();
            expect(mockParseCsv).not.toHaveBeenCalled();
            expect(result).toBe(expectedResult);
        });

        it("should parse Excel file without pageName", () => {
            const file = createMockFile("data.xls");
            const expectedResult = { entities: [], errors: [], parsedInfos: {} as ScdlParsedInfos };

            mockParseXls.mockReturnValue(expectedResult);

            // @ts-expect-error - test private method
            const result = depositScdlProcessService.parseFile(file, undefined);

            expect(mockParseXls).toHaveBeenCalledWith(file.buffer, undefined);
            expect(mockDetectCsvDelimiter).not.toHaveBeenCalled();
            expect(mockParseCsv).not.toHaveBeenCalled();
            expect(result).toBe(expectedResult);
        });
    });

    describe("find", () => {
        it("Should call find method", async () => {
            mockFindDepositLog.mockResolvedValueOnce([DEPOSIT_LOG_ENTITY]);

            await depositScdlProcessService.find();

            expect(mockFindDepositLog).toHaveBeenCalled();
        });

        it("Should return DepositLogs", async () => {
            mockFindDepositLog.mockResolvedValueOnce([DEPOSIT_LOG_ENTITY]);

            const actual = await depositScdlProcessService.find();

            expect(actual).toEqual([DEPOSIT_LOG_ENTITY]);
        });
    });

    describe("parseAndPersistScdlFile", () => {
        let persistMock;
        let deletDepositMock;

        const mockGetProducer = jest.spyOn(scdlService, "getProducer") as jest.SpyInstance<
            Promise<MiscScdlProducerEntity | null>,
            [Siret]
        >;
        const mockCreateProducer = jest.spyOn(scdlService, "createProducer") as jest.SpyInstance<
            Promise<MiscScdlProducerEntity | null>,
            [Siret]
        >;
        beforeEach(() => {
            jest.spyOn(depositScdlProcessCheckService, "finalCheckBeforePersist").mockResolvedValue(undefined);
            persistMock = jest.spyOn(scdlService, "persist").mockResolvedValue(undefined);
            deletDepositMock = jest.spyOn(depositLogPort, "deleteByUserId").mockResolvedValue(true);
            jest.spyOn(dataLogService, "addLog").mockResolvedValue({} as InsertOneResult<DataLogEntity>);
            mockS3DeleteUserFile.mockResolvedValue();
            mockGetUserFile.mockResolvedValue(createMockFile("test.csv"));
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should throw not found error when not deposit log found", async () => {
            mockGetDepositLog.mockResolvedValueOnce(null);
            await expect(depositScdlProcessService.parseAndPersistScdlFile(USER_ID)).rejects.toThrow(NotFoundError);
        });

        it("should call createProducer if producer don't exists", async () => {
            const parsedResult = {
                entities: [],
                errors: [],
                parsedInfos: {
                    allocatorsSiret: ["12345678901234"],
                    grantCoverageYears: [2025],
                    parseableLines: 0,
                    totalLines: 0,
                    existingLinesInDbOnSamePeriod: 0,
                } as ScdlParsedInfos,
            };

            mockParseCsv.mockReturnValueOnce(parsedResult);

            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            mockGetProducer.mockResolvedValueOnce(null);
            mockCreateProducer.mockResolvedValueOnce({ siret: "12345678901234" } as MiscScdlProducerEntity);

            await depositScdlProcessService.parseAndPersistScdlFile(USER_ID);

            expect(mockCreateProducer).toHaveBeenCalledTimes(1);
            expect(mockCreateProducer).toHaveBeenCalledWith(new Siret(DEPOSIT_LOG_ENTITY_STEP_2.allocatorSiret!));
        });

        it("should not persist when blocking errors", async () => {
            const parsedResult = {
                entities: [],
                errors: [{ bloquant: "oui" } as MixedParsedError],
                parsedInfos: {
                    allocatorsSiret: ["12345678901234"],
                    grantCoverageYears: [2025],
                    parseableLines: 0,
                    totalLines: 0,
                    existingLinesInDbOnSamePeriod: 0,
                } as ScdlParsedInfos,
            };

            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            mockGetProducer.mockResolvedValueOnce({ siret: "12345678901234" } as MiscScdlProducerEntity);

            mockParseCsv.mockReturnValueOnce(parsedResult);

            await expect(depositScdlProcessService.parseAndPersistScdlFile(USER_ID)).rejects.toThrow(BadRequestError);

            expect(persistMock).not.toHaveBeenCalled();
            expect(deletDepositMock).not.toHaveBeenCalled();
        });

        it("should persist and delete deposit log", async () => {
            const parsedResult = {
                entities: [],
                errors: [],
                parsedInfos: {
                    allocatorsSiret: ["12345678901234"],
                    grantCoverageYears: [2025],
                    parseableLines: 0,
                    totalLines: 0,
                    existingLinesInDbOnSamePeriod: 0,
                } as ScdlParsedInfos,
            };

            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            mockGetProducer.mockResolvedValueOnce({ siret: "12345678901234" } as MiscScdlProducerEntity);

            mockParseCsv.mockReturnValueOnce(parsedResult);

            await depositScdlProcessService.parseAndPersistScdlFile(USER_ID);

            expect(persistMock).toHaveBeenCalledTimes(1);
            expect(deletDepositMock).toHaveBeenCalledTimes(1);
        });
    });
});

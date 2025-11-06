import {
    CREATE_DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_ENTITY,
    DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
} from "./__fixtures__/depositLog.fixture";
import depositScdlProcessService from "./depositScdlProcess.service";
import DepositScdlLogEntity from "./entities/depositScdlLog.entity";
import { ConflictError, NotFoundError } from "core";
import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import DepositScdlLogDtoAdapter from "./depositScdlLog.dto.adapter";
import scdlService from "../providers/scdl/scdl.service";
import { ScdlStorableGrant } from "../providers/scdl/@types/ScdlStorableGrant";
import { MixedParsedError } from "../providers/scdl/@types/Validation";
import UploadedFileInfosEntity from "./entities/uploadedFileInfos.entity";
import * as FileHelper from "../../shared/helpers/FileHelper";
import { ScdlParsedInfos } from "../providers/scdl/@types/ScdlParsedInfos";
import MiscScdlGrantEntity from "../providers/scdl/entities/MiscScdlGrantEntity";

jest.mock("./check/DepositScdlProcess.check.service");
jest.mock("../../dataProviders/db/deposit-log/depositLog.port");
jest.mock("../../dataProviders/db/deposit-log/DepositLog.adapter");
jest.mock("../providers/scdl/scdl.service.ts");

describe("DepositScdlProcessService", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

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

    describe("getDepositLog", () => {
        const mockGetDepositLog = jest.spyOn(depositScdlProcessService, "getDepositLog") as jest.SpyInstance<
            Promise<DepositScdlLogEntity | null>,
            [string]
        >;

        it("Should return a DepositLog", async () => {
            const expected = DEPOSIT_LOG_ENTITY;

            mockGetDepositLog.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await depositScdlProcessService.getDepositLog(USER_ID);

            expect(expected).toEqual(actual);
        });

        it("should call getDepositLog with userId", async () => {
            mockGetDepositLog.mockImplementationOnce(() => Promise.resolve(null));

            await depositScdlProcessService.getDepositLog(USER_ID);

            expect(mockGetDepositLog).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe("deleteDepositLog", () => {
        const mockDeleteDepositLog = jest.spyOn(depositScdlProcessService, "deleteDepositLog") as jest.SpyInstance<
            Promise<void>,
            [string]
        >;

        it("Should return an empty promise", async () => {
            mockDeleteDepositLog.mockImplementationOnce(() => Promise.resolve());

            expect(await depositScdlProcessService.deleteDepositLog(USER_ID)).toBeUndefined();
        });

        it("should call deleteDepositLog with userId", async () => {
            mockDeleteDepositLog.mockImplementationOnce(() => Promise.resolve());

            await depositScdlProcessService.deleteDepositLog(USER_ID);

            expect(mockDeleteDepositLog).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe("createDepositLog", () => {
        const mockGetDepositLog = jest.spyOn(depositScdlProcessService, "getDepositLog") as jest.SpyInstance<
            Promise<DepositScdlLogEntity | null>,
            [string]
        >;
        afterEach(() => {
            jest.clearAllMocks();
        });

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
        const mockGetDepositLog = jest.spyOn(depositScdlProcessService, "getDepositLog") as jest.SpyInstance<
            Promise<DepositScdlLogEntity | null>,
            [string]
        >;

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
        const mockGetDepositLog = jest.spyOn(depositScdlProcessService, "getDepositLog") as jest.SpyInstance<
            Promise<DepositScdlLogEntity | null>,
            [string]
        >;
        const mockParseCsv = jest.spyOn(scdlService, "parseCsv") as jest.SpyInstance<
            { entities: ScdlStorableGrant[]; errors: MixedParsedError[]; parsedInfos: ScdlParsedInfos },
            [fileContent: Buffer, delimiter?: string, quote?: string]
        >;
        const mockgetGrantsOnPeriodByAllocator = jest.spyOn(
            scdlService,
            "getGrantsOnPeriodByAllocator",
        ) as jest.SpyInstance<Promise<MiscScdlGrantEntity[]>, [allocatorSiret: string, exercices: number[]]>;

        it("Should return deposit log with correct informations", async () => {
            const mockDate = new Date("2025-11-04T10:30:00Z");
            jest.spyOn(global, "Date").mockImplementation(() => mockDate as never);
            mockGetDepositLog.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY);
            mockgetGrantsOnPeriodByAllocator.mockResolvedValueOnce([
                {} as MiscScdlGrantEntity,
                {} as MiscScdlGrantEntity,
            ]);
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
        const mockDetectCsvDelimiter = jest.spyOn(FileHelper, "detectCsvDelimiter");
        const mockParseCsv = jest.spyOn(scdlService, "parseCsv");
        const mockParseXls = jest.spyOn(scdlService, "parseXls");

        afterEach(() => {
            jest.clearAllMocks();
        });

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
        const mockFindDepositLog = jest.spyOn(depositScdlProcessService, "find") as jest.SpyInstance<
            Promise<DepositScdlLogEntity[]>,
            []
        >;

        afterEach(() => {
            mockFindDepositLog.mockClear();
        });

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
});

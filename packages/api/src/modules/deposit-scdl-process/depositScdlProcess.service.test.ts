import {
    CREATE_DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_ENTITY,
    DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
} from "./__fixtures__/depositLog.fixture";
import depositScdlProcessService from "./depositScdlProcess.service";
import DepositScdlLogEntity from "./depositScdlLog.entity";
import { ConflictError, NotFoundError } from "core";
import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import DepositScdlLogDtoAdapter from "./depositScdlLog.dto.adapter";

jest.mock("./check/DepositScdlProcess.check.service");
jest.mock("../../dataProviders/db/deposit-log/depositLog.port");
jest.mock("../../dataProviders/db/deposit-log/DepositLog.adapter");

describe("DepositScdlProcessService", () => {
    const USER_ID = "userId";

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

        afterEach(() => {
            mockGetDepositLog.mockRestore();
        });

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

    describe("find", () => {
        const mockFindDepositLog = jest.spyOn(depositScdlProcessService, "find") as jest.SpyInstance<
            Promise<DepositScdlLogEntity[]>,
            []
        >;

        afterEach(() => {
            mockFindDepositLog.mockRestore();
        });

        it("Should return DepositLogs", async () => {
            mockFindDepositLog.mockResolvedValueOnce([DEPOSIT_LOG_ENTITY]);

            const actual = await depositScdlProcessService.find();

            expect(mockFindDepositLog).toHaveBeenCalled();

            expect(actual).toEqual([DEPOSIT_LOG_ENTITY]);
        });
    });
});

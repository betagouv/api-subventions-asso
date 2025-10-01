import { DEPOSIT_LOG_DTO } from "./__fixtures__/depositLog.fixture";
import depositScdlProcessService from "./depositScdlProcess.service";
import { DepositScdlLogDto } from "dto";

describe("DepositScdlProcessService", () => {
    const USER_ID = "userId";

    describe("getDepositState", () => {
        const mockGetDepositState = jest.spyOn(depositScdlProcessService, "getDepositLog") as jest.SpyInstance<
            Promise<DepositScdlLogDto | null>,
            [string]
        >;

        it("Should return a depositState", async () => {
            const expected = DEPOSIT_LOG_DTO;

            mockGetDepositState.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await depositScdlProcessService.getDepositLog(USER_ID);

            expect(expected).toEqual(actual);
        });

        it("should call getDepositState with userId", async () => {
            mockGetDepositState.mockImplementationOnce(() => Promise.resolve(null));

            await depositScdlProcessService.getDepositLog(USER_ID);

            expect(mockGetDepositState).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe("deleteDepositState", () => {
        const mockDeleteDepositState = jest.spyOn(depositScdlProcessService, "deleteDepositLog") as jest.SpyInstance<
            Promise<void>,
            [string]
        >;

        it("Should return an empty promise", async () => {
            mockDeleteDepositState.mockImplementationOnce(() => Promise.resolve());

            expect(await depositScdlProcessService.deleteDepositLog(USER_ID)).toBeUndefined();
        });

        it("should call deleteDepositState with userId", async () => {
            mockDeleteDepositState.mockImplementationOnce(() => Promise.resolve());

            await depositScdlProcessService.deleteDepositLog(USER_ID);

            expect(mockDeleteDepositState).toHaveBeenCalledWith(USER_ID);
        });
    });
});

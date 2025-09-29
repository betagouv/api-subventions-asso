import { DEPOSIT_LOG_DTO } from "./__fixtures__/depositLog.fixture";
import depositScdlProcessService from "./depositScdlProcess.service";
import { DepositScdlLogDto } from "dto";

describe("DepositScdlProcessService", () => {
    const USER_ID = "userId";

    describe("getDepositState", () => {
        const mockGetDepositState = jest.spyOn(depositScdlProcessService, "getDepositState") as jest.SpyInstance<
            Promise<DepositScdlLogDto | null>,
            [string]
        >;

        it("Should return a depositState", async () => {
            const expected = DEPOSIT_LOG_DTO;

            mockGetDepositState.mockImplementationOnce(() => Promise.resolve(expected));

            const actual = await depositScdlProcessService.getDepositState(USER_ID);

            expect(expected).toEqual(actual);
        });

        it("should call getDepositState with userId", async () => {
            mockGetDepositState.mockImplementationOnce(() => Promise.resolve(null));

            await depositScdlProcessService.getDepositState(USER_ID);

            expect(mockGetDepositState).toHaveBeenCalledWith(USER_ID);
        });
    });
});

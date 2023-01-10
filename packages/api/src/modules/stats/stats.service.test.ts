import statsService from "./stats.service";
import statsRepository from "./repositories/statsRepository";
import { firstDayOfPeriod } from "../../shared/helpers/DateHelper";
import userService from "../user/user.service";
import * as DateHelper from "../../shared/helpers/DateHelper";

describe("StatsService", () => {
    describe("getNbUsersByRequestsOnPeriod()", () => {
        const countUsersByRequestNbOnPeriodMock = jest.spyOn(statsRepository, "countUsersByRequestNbOnPeriod");

        const TODAY = new Date();
        const NB_REQUESTS = 5;
        const START = new Date(TODAY);
        START.setDate(START.getDate() + -1);
        const END = new Date(TODAY);
        END.setDate(END.getDate() + 1);

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            countUsersByRequestNbOnPeriodMock.mockImplementationOnce((start, end, minReq) => Promise.resolve(7));
        });

        it("should call repository", async () => {
            const expected = [START, END, NB_REQUESTS, false];
            const actual = statsRepository.countUsersByRequestNbOnPeriod;
            await statsService.getNbUsersByRequestsOnPeriod(START, END, NB_REQUESTS, false);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        it("should call repository with includesAdmin", async () => {
            const expected = [START, END, NB_REQUESTS, true];
            const actual = statsRepository.countUsersByRequestNbOnPeriod;
            await statsService.getNbUsersByRequestsOnPeriod(START, END, NB_REQUESTS, true);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        it("should call repository", async () => {
            const expected = 7;
            const actual = await statsService.getNbUsersByRequestsOnPeriod(START, END, NB_REQUESTS, false);
            expect(actual).toBe(expected);
        });
    });

    describe("getMedianRequestsOnPeriod()", () => {
        const countMedianRequestsOnPeriodMock = jest.spyOn(statsRepository, "countMedianRequestsOnPeriod");

        const TODAY = new Date();
        const START = new Date(TODAY);
        START.setDate(START.getDate() + -1);
        const END = new Date(TODAY);
        END.setDate(END.getDate() + 1);

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            countMedianRequestsOnPeriodMock.mockImplementationOnce((start, end, minReq) => Promise.resolve(7));
        });

        it("should call repository", async () => {
            const expected = [START, END, false];
            const actual = statsRepository.countMedianRequestsOnPeriod;
            await statsService.getMedianRequestsOnPeriod(START, END, false);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        it("should call repository with includesAdmin", async () => {
            const expected = [START, END, true];
            const actual = statsRepository.countMedianRequestsOnPeriod;
            await statsService.getMedianRequestsOnPeriod(START, END, true);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        it("should call repository", async () => {
            const expected = 7;
            const actual = await statsService.getMedianRequestsOnPeriod(START, END, false);
            expect(actual).toBe(expected);
        });
    });

    describe("getRequestsPerMonthByYear()", () => {
        const monthlyAvgRequestsOnPeriodMock = jest.spyOn(statsRepository, "countRequestsPerMonthByYear");

        const YEAR = 2022;
        const mockedValue = {
            January: 201,
            February: 21,
            March: 20,
            April: 201,
            May: 13,
            June: 201,
            July: 201,
            August: 15,
            September: 201,
            October: 300,
            November: 201,
            December: 1
        };

        beforeEach(() => {
            monthlyAvgRequestsOnPeriodMock.mockResolvedValueOnce(mockedValue);
        });

        it("should call repository", async () => {
            const expected = [YEAR, false];
            const actual = statsRepository.countRequestsPerMonthByYear;
            await statsService.getRequestsPerMonthByYear(YEAR, false);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        it("should call repository with includesAdmin", async () => {
            const expected = [YEAR, true];
            const actual = statsRepository.countRequestsPerMonthByYear;
            await statsService.getRequestsPerMonthByYear(YEAR, true);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        it("should call repository", async () => {
            const expected = mockedValue;
            const actual = await statsService.getRequestsPerMonthByYear(YEAR, false);
            expect(actual).toStrictEqual(expected);
        });
    });

    describe("getMonthlyUserNbByYear()", () => {
        const initCountMock = jest.spyOn(userService, "countTotalUsersOnDate");
        const getUsersMock = jest.spyOn(userService, "findAndSortByPeriod");
        const firstDayMock = jest.spyOn(DateHelper, "firstDayOfPeriod");
        const oneYearLaterMock = jest.spyOn(DateHelper, "oneYearAfterPeriod");

        const YEAR = 2022;
        const FINAL_DATA = {
            January: 3,
            February: 3,
            March: 4,
            April: 4,
            May: 4,
            June: 4,
            July: 4,
            August: 4,
            September: 5,
            October: 5,
            November: 5,
            December: 5
        };
        const USER_DATA = [
            { signupAt: new Date(YEAR, 0, 23) },
            { signupAt: new Date(YEAR, 2, 3) },
            { signupAt: new Date(YEAR, 8, 16) }
        ];
        const INIT_COUNT = 2;
        const FIRST_DAY_PERIOD = new Date(YEAR, 0, 1);
        const NEXT_DAY_PERIOD = new Date(YEAR + 1, 0, 0);

        beforeAll(() => {
            initCountMock.mockResolvedValue(INIT_COUNT);
            // @ts-expect-error mock
            getUsersMock.mockResolvedValue(USER_DATA);
            firstDayMock.mockReturnValue(FIRST_DAY_PERIOD);
            oneYearLaterMock.mockReturnValue(NEXT_DAY_PERIOD);
        });
        afterAll(() => {
            initCountMock.mockRestore();
            getUsersMock.mockRestore();
            firstDayMock.mockRestore();
            oneYearLaterMock.mockRestore();
        });

        it("should call date Helpers", async () => {
            await statsService.getMonthlyUserNbByYear(YEAR);
            expect(firstDayMock).toBeCalledWith(YEAR);
            expect(oneYearLaterMock).toBeCalledWith(YEAR);
        });

        it("should call init count with proper date", async () => {
            await statsService.getMonthlyUserNbByYear(YEAR);
            expect(initCountMock).toBeCalledWith(FIRST_DAY_PERIOD);
        });

        it("should get users from proper period", async () => {
            await statsService.getMonthlyUserNbByYear(YEAR);
            expect(getUsersMock).toBeCalledWith(FIRST_DAY_PERIOD, NEXT_DAY_PERIOD);
        });

        it("should return proper result", async () => {
            const actual = await statsService.getMonthlyUserNbByYear(YEAR);
            const expected = FINAL_DATA;
            expect(actual).toEqual(expected);
        });

        it("should not forget init count", async () => {
            const INIT_COUNT_ALT = 12;
            const diff = -INIT_COUNT + INIT_COUNT_ALT;
            initCountMock.mockResolvedValueOnce(INIT_COUNT_ALT);
            const FINAL_DATA_ALT = {};
            for (const [month, count] of Object.entries(FINAL_DATA)) {
                FINAL_DATA_ALT[month] = count + diff;
            }
            const actual = await statsService.getMonthlyUserNbByYear(YEAR);
            const expected = FINAL_DATA_ALT;
            expect(actual).toEqual(expected);
        });
    });
});

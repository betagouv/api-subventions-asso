import statsService from "./stats.service";
import statsRepository from "./repositories/statsRepository";

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
});

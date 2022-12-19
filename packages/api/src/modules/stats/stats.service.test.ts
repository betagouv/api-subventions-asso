import statsService from "./stats.service";
import statsRepository from "./repositories/statsRepository";
import assoVisitsRepository from "./repositories/associationVisits.repository";
import userRepository from "../user/repositories/user.repository";
import { dateToUTCMonthYear, firstDayOfPeriod } from "../../shared/helpers/DateHelper";

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

    describe("Association visits", () => {
        const TODAY = new Date();
        const THIS_MONTH = dateToUTCMonthYear(TODAY);
        const END = THIS_MONTH;
        const START = new Date(Date.UTC(THIS_MONTH.getFullYear() - 1, THIS_MONTH.getMonth() + 1, 1));

        describe("registerRequest()", () => {
            const assoVisitRepoMock = jest
                .spyOn(assoVisitsRepository, "updateAssoVisitCountByIncrement")
                .mockImplementation(jest.fn());

            const ASSO_NO_NAME = {};
            const SIREN_NAME = "NOM_SIREN";
            const RNA_NAME = "NOM_RNA";
            const ASSO_SIREN_NAME = { denomination_siren: [{ value: SIREN_NAME }] };
            const ASSO_RNA_NAME = { denomination_rna: [{ value: RNA_NAME }] };
            const ASSO_2_NAMES = { ...ASSO_RNA_NAME, ASSO_SIREN_NAME };

            async function checkArgs(asso, expectedName, expectedDate = expect.anything()) {
                await statsService.registerRequest(asso);
                expect(assoVisitRepoMock).toHaveBeenCalledWith(expectedName, expectedDate);
            }

            it("fails if no name", async () => {
                await statsService.registerRequest(ASSO_NO_NAME);
                expect(assoVisitRepoMock).toHaveBeenCalledTimes(0);
            });

            it("can use rna name", () => checkArgs(ASSO_RNA_NAME, RNA_NAME));

            it("can use siren name", () => checkArgs(ASSO_SIREN_NAME, SIREN_NAME));

            it("should use rna's name if both available", () => checkArgs(ASSO_2_NAMES, RNA_NAME));

            it("should register visit to this month utc", () =>
                checkArgs(ASSO_RNA_NAME, expect.anything(), THIS_MONTH));
        });

        describe("getTopAssociations()", () => {
            const repoMock = jest.spyOn(assoVisitsRepository, "selectMostRequestedAssosByPeriod");

            const DEFAULT_LIMIT = 5;
            const mockedValue = [
                { name: "Asso 1", nbRequests: 42 },
                { name: "Asso 2", nbRequests: 41 },
                { name: "Asso 3", nbRequests: 40 },
                { name: "Asso 4", nbRequests: 39 },
                { name: "Asso 5", nbRequests: 38 }
            ];

            beforeEach(() => {
                repoMock.mockResolvedValueOnce(mockedValue);
            });

            it("should call repository with proper default values", async () => {
                await statsService.getTopAssociationsByPeriod();
                expect(repoMock).toHaveBeenCalledWith(DEFAULT_LIMIT, START, END);
            });

            it("should return result of service function", async () => {
                const actual = await statsService.getTopAssociationsByPeriod();
                expect(actual).toStrictEqual(mockedValue);
            });

            const some_date = new Date(2022, 1, 20, 17, 25, 45, 98);
            const utc_month = firstDayOfPeriod(2022, 1);
            const utc_month_earlier = firstDayOfPeriod(2021, 2);

            it("should set start date to first of month", async () => {
                await statsService.getTopAssociationsByPeriod(DEFAULT_LIMIT, some_date);
                expect(repoMock).toHaveBeenCalledWith(expect.anything(), utc_month, expect.anything());
            });

            it("should set end date to first of month", async () => {
                await statsService.getTopAssociationsByPeriod(DEFAULT_LIMIT, START, some_date);
                expect(repoMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), utc_month);
            });

            it("should compute start date from end date if undefined", async () => {
                await statsService.getTopAssociationsByPeriod(DEFAULT_LIMIT, undefined, some_date);
                expect(repoMock).toHaveBeenCalledWith(expect.anything(), utc_month_earlier, utc_month);
            });
        });
    });

    describe("getMonthlyUserNbByYear()", () => {
        const mock = jest.spyOn(userRepository, "getMonthlyNbByYear");

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

        beforeEach(() => mock.mockResolvedValueOnce(mockedValue));

        it("should call repository", async () => {
            await statsService.getMonthlyUserNbByYear(YEAR);
            expect(mock).toHaveBeenCalledWith(YEAR);
        });

        it("should return repo's return value", async () => {
            const actual = await statsService.getMonthlyUserNbByYear(YEAR);
            expect(actual).toStrictEqual(mockedValue);
        });
    });
});

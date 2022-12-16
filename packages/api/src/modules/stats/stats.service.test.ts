import statsService from "./stats.service";
import statsRepository from "./repositories/statsRepository";
import assoVisitsRepository from "./repositories/associationVisits.repository";

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
        const THIS_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
        const START = THIS_MONTH;
        const END = new Date(THIS_MONTH.getFullYear() - 1, THIS_MONTH.getMonth() + 1, 1);

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

            async function checkArgs(asso, expectedName) {
                const repo = assoVisitsRepository.updateAssoVisitCountByIncrement;
                await statsService.registerRequest(asso);
                expect(repo).toHaveBeenCalledWith(expectedName, expect.anything());
            }

            it("fails if no name", async () => {
                const repo = assoVisitsRepository.updateAssoVisitCountByIncrement;
                await statsService.registerRequest(ASSO_NO_NAME);
                expect(repo).toHaveBeenCalledTimes(0);
            });

            it("can use rna name", async () => {
                await checkArgs(ASSO_RNA_NAME, RNA_NAME);
            });

            it("can use siren name", async () => {
                await checkArgs(ASSO_SIREN_NAME, SIREN_NAME);
            });

            it("should use rna's name if both available", async () => {
                await checkArgs(ASSO_2_NAMES, RNA_NAME);
            });
        });

        describe("getTopAssociations()", () => {
            const repoMock = jest.spyOn(assoVisitsRepository, "selectMostRequestedAssosByPeriod");

            const LIMIT = 5;
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

            it("should call repository", async () => {
                await statsService.getTopAssociationsByPeriod(LIMIT, START, END);
                expect(repoMock).toHaveBeenCalledWith(LIMIT, START, END);
            });

            it("should return result of service function", async () => {
                const actual = await statsService.getTopAssociationsByPeriod(LIMIT, START, END);
                expect(actual).toStrictEqual(mockedValue);
            });
        });
    });
});

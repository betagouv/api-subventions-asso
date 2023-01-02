import statsService from "./stats.service";
import statsRepository from "./repositories/statsRepository";
import assoVisitsRepository from "./repositories/associationVisits.repository";
import associationNameService from "../association-name/associationName.service";
import { Rna, Siren } from "@api-subventions-asso/dto";

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
        type identifiers = { rna: Rna; siren: Siren };
        const TODAY = new Date();
        const THIS_MONTH = new Date(Date.UTC(TODAY.getFullYear(), TODAY.getMonth(), 1));

        describe("registerRequest()", () => {
            const assoVisitRepoMock = jest
                .spyOn(assoVisitsRepository, "updateAssoVisitCountByIncrement")
                .mockImplementation(jest.fn());

            const IDENTIFIERS = { rna: "RNA", siren: "SIREN" };

            async function checkArgs(identifiers, expectedIdentifier, expectedDate = expect.anything()) {
                await statsService.registerRequest(identifiers);
                expect(assoVisitRepoMock).toHaveBeenCalledWith(expectedIdentifier, expectedDate);
            }

            it("should register visit to this month utc", () => checkArgs(IDENTIFIERS, expect.anything(), THIS_MONTH));

            it("should register transfer identifier to repo call", () =>
                checkArgs(IDENTIFIERS, IDENTIFIERS, expect.anything()));
        });

        describe("getTopAssociations()", () => {
            const END = TODAY;
            const START = new Date(Date.UTC(THIS_MONTH.getFullYear() - 1, THIS_MONTH.getMonth() + 1, 1));

            const repoMock = jest.spyOn(assoVisitsRepository, "selectMostRequestedAssosByPeriod");
            const assoNameMock = jest.spyOn(associationNameService, "getNameFromIdentifier");

            const DEFAULT_LIMIT = 5;
            const mockedValue = [
                { _id: { siren: "siren-1", rna: "rna-1" }, nbRequests: 42 },
                { _id: { siren: "siren-2", rna: "rna-2" }, nbRequests: 41 },
                { _id: { siren: "siren-3", rna: "rna-3" }, nbRequests: 40 },
                { _id: { siren: "siren-4", rna: "rna-4" }, nbRequests: 39 },
                { _id: { siren: "siren-5", rna: "rna-5" }, nbRequests: 38 }
            ];

            beforeAll(() => {
                repoMock.mockResolvedValue(mockedValue);
                assoNameMock.mockImplementation(identifier => new Promise(r => r(`name-${identifier}`)));
                jest.useFakeTimers().setSystemTime(new Date(2023, 0, 20, 17, 25, 45, 98));
            });
            afterAll(() => {
                repoMock.mockClear();
                assoNameMock.mockClear();
                jest.useRealTimers();
            });

            // repo call
            it("should call repository with proper default values", async () => {
                await statsService.getTopAssociationsByPeriod();
                expect(repoMock).toHaveBeenCalledWith(DEFAULT_LIMIT, START, new Date());
            });

            const some_date = new Date(2022, 1, 20, 17, 25, 45, 98);
            const utc_month_earlier = new Date(Date.UTC(2021, 2));

            it("should call repo with start date", async () => {
                await statsService.getTopAssociationsByPeriod(DEFAULT_LIMIT, some_date);
                expect(repoMock).toHaveBeenCalledWith(expect.anything(), some_date, expect.anything());
            });

            it("should call repo with end date", async () => {
                await statsService.getTopAssociationsByPeriod(DEFAULT_LIMIT, START, some_date);
                expect(repoMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), some_date);
            });

            it("should compute start date from end date if undefined", async () => {
                await statsService.getTopAssociationsByPeriod(DEFAULT_LIMIT, undefined, some_date);
                expect(repoMock).toHaveBeenCalledWith(expect.anything(), utc_month_earlier, expect.anything());
            });

            // asso name service call
            it("should call name service as many times as needed", async () => {
                await statsService.getTopAssociationsByPeriod();
                expect(assoNameMock).toHaveBeenCalledTimes(mockedValue.length);
            });

            it("should call name service with rna if available", async () => {
                const IDENTIFIER = "rna";
                repoMock.mockResolvedValueOnce([{ _id: { siren: "AZERTY", rna: IDENTIFIER }, nbRequests: 42 }]);
                await statsService.getTopAssociationsByPeriod();
                expect(assoNameMock).toBeCalledWith(IDENTIFIER);
            });

            it("should call name service with siren if available but not rna", async () => {
                const IDENTIFIER = "siren";
                repoMock.mockResolvedValueOnce([{ _id: { siren: IDENTIFIER }, nbRequests: 42 }]);
                await statsService.getTopAssociationsByPeriod();
                expect(assoNameMock).toBeCalledWith(IDENTIFIER);
            });

            it("should use found name if any", async () => {
                const NAME = "found";
                repoMock.mockResolvedValueOnce([{ _id: { siren: "any" }, nbRequests: 42 }]);
                assoNameMock.mockResolvedValueOnce(NAME);
                const actual = (await statsService.getTopAssociationsByPeriod())?.[0]?.name;
                expect(actual).toEqual(NAME);
            });

            // final
            it("should return proper result", async () => {
                const expected = [
                    { name: "name-rna-1", nbRequests: 42 },
                    { name: "name-rna-2", nbRequests: 41 },
                    { name: "name-rna-3", nbRequests: 40 },
                    { name: "name-rna-4", nbRequests: 39 },
                    { name: "name-rna-5", nbRequests: 38 }
                ];
                const actual = await statsService.getTopAssociationsByPeriod();
                expect(actual).toEqual(expected);
            });

            it("should filter out empty name records", async () => {
                assoNameMock.mockResolvedValueOnce(undefined);
                const actual = await statsService.getTopAssociationsByPeriod();
                expect(actual).toHaveLength(4);
            });
        });
    });
});

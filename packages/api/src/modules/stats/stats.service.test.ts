const mockIsUserActif = jest.fn();

jest.mock("../../shared/helpers/UserHelper", () => {
    return {
        __esModule: true, // this property makes it work
        isUserActif: mockIsUserActif
    };
});

import * as UserHelper from "../../shared/helpers/UserHelper";
import statsService from "./stats.service";
import userService from "../user/user.service";
import * as DateHelper from "../../shared/helpers/DateHelper";
import associationNameService from "../association-name/associationName.service";
import statsRepository from "./repositories/stats.repository";
import statsAssociationsVisitRepository from "./repositories/statsAssociationsVisit.repository";
import AssociationVisitEntity from "./entities/AssociationVisitEntity";
import userRepository from "../user/repositories/user.repository";
import UserDbo from "../user/repositories/dbo/UserDbo";

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
        const getUsersMock = jest.spyOn(userService, "findByPeriod");
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

    describe("getTopAssociationsByPeriod()", () => {
        const TODAY = new Date();
        const END = new Date(Date.UTC(TODAY.getFullYear(), TODAY.getMonth(), 1));
        const START = new Date(Date.UTC(END.getFullYear() - 1, END.getMonth() + 1, 1));

        const findGroupedByAssociationIdentifierOnPeriodMock: jest.SpyInstance = jest.spyOn(
            statsAssociationsVisitRepository,
            "findGroupedByAssociationIdentifierOnPeriod"
        );
        const getNameFromIdentifierMock = jest.spyOn(associationNameService, "getNameFromIdentifier");
        const groupAssociationVisitsByAssociationMock: jest.SpyInstance = jest.spyOn(
            statsService,
            // @ts-expect-error groupAssociationVisitsByAssociation is private method
            "groupAssociationVisitsByAssociation"
        );
        // @ts-expect-error groupAssociationVisitsByAssociation is private method
        const keepOneVisitByUserAndDateMock: jest.SpyInstance = jest.spyOn(statsService, "keepOneVisitByUserAndDate");

        afterAll(() => {
            keepOneVisitByUserAndDateMock.mockRestore();
            getNameFromIdentifierMock.mockRestore();
        });

        it("should throw error, start date is invalid", async () => {
            const invalidDate = new Date("");

            await expect(async () => statsService.getTopAssociationsByPeriod(5, invalidDate, END)).rejects.toThrowError(
                "Invalid Date"
            );
        });

        it("should throw error, start date is undefined", async () => {
            await expect(async () =>
                statsService.getTopAssociationsByPeriod(5, undefined as unknown as Date, END)
            ).rejects.toThrowError("Invalid Date");
        });

        it("should throw error, end date is invalid", async () => {
            const invalidDate = new Date("");

            await expect(async () =>
                statsService.getTopAssociationsByPeriod(5, START, invalidDate)
            ).rejects.toThrowError("Invalid Date");
        });

        it("should throw error, end date is undefined", async () => {
            await expect(async () =>
                statsService.getTopAssociationsByPeriod(5, START, undefined as unknown as Date)
            ).rejects.toThrowError("Invalid Date");
        });

        it("should call repository with arguments", async () => {
            findGroupedByAssociationIdentifierOnPeriodMock.mockImplementationOnce(async () => []);
            await statsService.getTopAssociationsByPeriod(5, START, END);

            expect(findGroupedByAssociationIdentifierOnPeriodMock).toHaveBeenCalledWith(START, END);
        });

        it("should call groupAssociationVisitsByAssociation with database data", async () => {
            const expected = [
                {
                    fake: "data"
                }
            ];
            findGroupedByAssociationIdentifierOnPeriodMock.mockImplementationOnce(async () => expected);
            groupAssociationVisitsByAssociationMock.mockImplementationOnce(async () => []);

            await statsService.getTopAssociationsByPeriod(5, START, END);

            expect(groupAssociationVisitsByAssociationMock).toHaveBeenCalledWith(expected);
        });

        it("should call keepOneVisitByUserAndDate with visits", async () => {
            const expected = ["Visit1", "Visit2"];
            const DATA = [
                {
                    id: "",
                    visits: expected
                }
            ];
            findGroupedByAssociationIdentifierOnPeriodMock.mockImplementationOnce(async () => []);
            groupAssociationVisitsByAssociationMock.mockImplementationOnce(async () => DATA);
            keepOneVisitByUserAndDateMock.mockImplementationOnce(data => data);
            getNameFromIdentifierMock.mockImplementationOnce(async () => undefined);
            await statsService.getTopAssociationsByPeriod(5, START, END);

            expect(keepOneVisitByUserAndDateMock).toHaveBeenCalledWith(expected);
        });

        it("should call keepOneVisitByUserAndDate with id", async () => {
            const expected = "W123456789";
            const DATA = [
                {
                    id: expected,
                    visits: "Visits"
                }
            ];
            findGroupedByAssociationIdentifierOnPeriodMock.mockImplementationOnce(async () => []);
            groupAssociationVisitsByAssociationMock.mockImplementationOnce(async () => DATA);
            keepOneVisitByUserAndDateMock.mockImplementationOnce(data => data);
            getNameFromIdentifierMock.mockImplementationOnce(async () => undefined);
            await statsService.getTopAssociationsByPeriod(5, START, END);

            expect(getNameFromIdentifierMock).toHaveBeenCalledWith(expected);
        });

        it("should return result with length 1", async () => {
            const expected = 1;
            const DATA = [
                {
                    id: "ID2",
                    visits: "Visits"
                },
                {
                    id: "ID1",
                    visits: "Visits"
                }
            ];
            findGroupedByAssociationIdentifierOnPeriodMock.mockImplementationOnce(async () => []);
            groupAssociationVisitsByAssociationMock.mockImplementationOnce(async () => DATA);
            keepOneVisitByUserAndDateMock.mockImplementation(data => data);
            getNameFromIdentifierMock.mockImplementation(async () => undefined);
            const actual = await statsService.getTopAssociationsByPeriod(1, START, END);

            expect(actual.length).toBe(expected);
        });

        it("should return sorted result", async () => {
            const expected = [
                {
                    name: "ID2",
                    visits: 42
                },
                {
                    name: "ID1",
                    visits: 1
                }
            ];
            const DATA = [
                {
                    id: "ID1",
                    visits: { length: 1 }
                },
                {
                    id: "ID2",
                    visits: { length: 42 }
                }
            ];
            findGroupedByAssociationIdentifierOnPeriodMock.mockImplementationOnce(async () => []);
            groupAssociationVisitsByAssociationMock.mockImplementationOnce(async () => DATA);
            keepOneVisitByUserAndDateMock.mockImplementation(data => data);
            getNameFromIdentifierMock.mockImplementation(async () => undefined);
            const actual = await statsService.getTopAssociationsByPeriod(2, START, END);

            expect(actual).toEqual(expected);
        });

        it("should return named result", async () => {
            const expected = {
                name: "Association 1",
                visits: 42
            };
            const DATA = [
                {
                    id: "ID",
                    visits: { length: 42 }
                }
            ];
            findGroupedByAssociationIdentifierOnPeriodMock.mockImplementationOnce(async () => []);
            groupAssociationVisitsByAssociationMock.mockImplementationOnce(async () => DATA);
            keepOneVisitByUserAndDateMock.mockImplementation(data => data);
            getNameFromIdentifierMock.mockImplementationOnce(async () => expected.name);
            const actual = await statsService.getTopAssociationsByPeriod(2, START, END);

            expect(actual).toEqual([expected]);
        });
    });

    describe("groupAssociationVisitsByAssociation", () => {
        // @ts-expect-error groupVisitsOnMaps is private method
        const groupVisitsOnMapsMock: jest.SpyInstance = jest.spyOn(statsService, "groupVisitsOnMaps");

        const RNA = "W123456789";
        const SIREN = "123456789";

        afterAll(() => {
            groupVisitsOnMapsMock.mockRestore();
        });

        it("should call groupVisitsOnMap", async () => {
            groupVisitsOnMapsMock.mockImplementationOnce(async () => {});

            // @ts-expect-error groupAssociationVisitsByAssociation is private method
            await statsService.groupAssociationVisitsByAssociation([{ _id: RNA, visits: [] }]);
            expect(groupVisitsOnMapsMock).toBeCalledTimes(1);
        });

        it("should call groupVisitsOnMap", async () => {
            groupVisitsOnMapsMock.mockImplementation(async () => {});
            const expected = [
                { _id: RNA, visits: ["AA"] },
                { _id: SIREN, visits: ["BB"] }
            ];
            // @ts-expect-error groupAssociationVisitsByAssociation is private method
            await statsService.groupAssociationVisitsByAssociation(expected);
            expect(groupVisitsOnMapsMock).toBeCalledWith(expected[0], expect.any(Map), expect.any(Map));
            expect(groupVisitsOnMapsMock).toBeCalledWith(expected[1], expect.any(Map), expect.any(Map));
        });

        it("should return just unique values", async () => {
            const expected = { test: true };
            groupVisitsOnMapsMock.mockImplementationOnce(async (t, rnaMap, sirenMap) => {
                rnaMap.set(RNA, expected);
                sirenMap.set(SIREN, expected);
            });

            // @ts-expect-error groupAssociationVisitsByAssociation is private method
            const actual = await statsService.groupAssociationVisitsByAssociation([
                { _id: RNA, visits: ["AA"] as unknown as AssociationVisitEntity[] },
                { _id: SIREN, visits: ["BB"] as unknown as AssociationVisitEntity[] }
            ]);

            expect(actual).toHaveLength(1);
            expect(actual).toEqual([expected]);
        });
    });

    describe("groupVisitsOnMaps", () => {
        const RNA = "W123456789";
        const SIREN = "123456789";

        const getGroupedIdentifiersMock = jest.spyOn(associationNameService, "getGroupedIdentifiers");

        it("should add visits on rnaMap because is already available", async () => {
            const rnaMap = new Map([[RNA, { id: RNA, visits: [] }]]);
            const sirenMap = new Map();
            const expected = [
                {
                    visits: 1
                }
            ];
            // @ts-expect-error groupVisitsOnMaps is private methode
            await statsService.groupVisitsOnMaps({ _id: RNA, visits: expected }, rnaMap, sirenMap);

            expect(rnaMap.get(RNA)).toEqual({ id: RNA, visits: expected });
        });
        it("should add visits on rnaMap because is already available", async () => {
            const sirenMap = new Map([[SIREN, { id: SIREN, visits: [] }]]);
            const rnaMap = new Map();
            const expected = [
                {
                    visits: 1
                }
            ];
            // @ts-expect-error groupVisitsOnMaps is private methode
            await statsService.groupVisitsOnMaps({ _id: SIREN, visits: expected }, rnaMap, sirenMap);

            expect(sirenMap.get(SIREN)).toEqual({ id: SIREN, visits: expected });
        });

        it("should add visits on rnaMap and siren because is already available", async () => {
            const expected = { id: SIREN, visits: [] };
            const sirenMap = new Map([[SIREN, expected]]);
            const rnaMap = new Map([[RNA, expected]]);
            // @ts-expect-error groupVisitsOnMaps is private methode
            await statsService.groupVisitsOnMaps(
                {
                    _id: SIREN,
                    visits: [
                        {
                            visits: 1
                        }
                    ]
                },
                rnaMap,
                sirenMap
            );
            expect(sirenMap.get(SIREN)).toBe(expected);
            expect(rnaMap.get(RNA)).toBe(expected);
        });

        it("should getting all identifers of association", async () => {
            getGroupedIdentifiersMock.mockImplementationOnce(async () => ({
                rna: RNA,
                siren: SIREN
            }));
            const sirenMap = new Map();
            const rnaMap = new Map();
            // @ts-expect-error groupVisitsOnMaps is private methode
            await statsService.groupVisitsOnMaps(
                {
                    _id: SIREN,
                    visits: [
                        {
                            visits: 1
                        }
                    ]
                },
                rnaMap,
                sirenMap
            );

            expect(getGroupedIdentifiersMock).toHaveBeenCalledWith(SIREN);
        });

        it("should add visits on all maps", async () => {
            getGroupedIdentifiersMock.mockImplementationOnce(async () => ({
                rna: RNA,
                siren: SIREN
            }));
            const sirenMap = new Map();
            const rnaMap = new Map();
            const expected = {
                id: SIREN,
                visits: [
                    {
                        visits: 1
                    }
                ]
            };
            // @ts-expect-error groupVisitsOnMaps is private methode
            await statsService.groupVisitsOnMaps({ _id: SIREN, visits: expected.visits }, rnaMap, sirenMap);

            expect(sirenMap.get(SIREN)).toEqual(expected);
            expect(rnaMap.get(RNA)).toEqual(expected);

            expect(rnaMap.get(RNA)).toBe(sirenMap.get(SIREN));
        });

        it("should add visits on sirenMap", async () => {
            getGroupedIdentifiersMock.mockImplementationOnce(async () => ({
                rna: undefined,
                siren: SIREN
            }));
            const sirenMap = new Map();
            const rnaMap = new Map();
            const expected = {
                id: SIREN,
                visits: [
                    {
                        visits: 1
                    }
                ]
            };
            // @ts-expect-error groupVisitsOnMaps is private methode
            await statsService.groupVisitsOnMaps({ _id: SIREN, visits: expected.visits }, rnaMap, sirenMap);

            expect(sirenMap.get(SIREN)).toEqual(expected);
        });

        it("should add visits on rnaMap", async () => {
            getGroupedIdentifiersMock.mockImplementationOnce(async () => ({
                rna: RNA,
                siren: undefined
            }));
            const sirenMap = new Map();
            const rnaMap = new Map();
            const expected = {
                id: RNA,
                visits: [
                    {
                        visits: 1
                    }
                ]
            };
            // @ts-expect-error groupVisitsOnMaps is private methode
            await statsService.groupVisitsOnMaps({ _id: RNA, visits: expected.visits }, rnaMap, sirenMap);

            expect(rnaMap.get(RNA)).toEqual(expected);
        });
    });

    describe("keepOneVisitByUserAndDate", () => {
        const TEN_MINUTE_MS = 1000 * 60 * 10;

        it("should return one visit", () => {
            const expected = {
                userId: "USER_ID",
                date: new Date()
            };

            const visits = [
                {
                    userId: "USER_ID",
                    date: new Date(expected.date.getTime() + TEN_MINUTE_MS)
                },
                expected
            ];
            // @ts-expect-error groupVisitsOnMaps is private methode
            const actual = statsService.keepOneVisitByUserAndDate(visits);

            expect(actual).toEqual([expected]);
            expect(actual).toHaveLength(1);
        });

        it("should return two visits", () => {
            const expected = [
                {
                    userId: "USER_ID",
                    date: new Date()
                },
                {
                    userId: "USER_ID_2",
                    date: new Date()
                }
            ];

            const visits = [
                {
                    userId: "USER_ID",
                    date: new Date(expected[0].date.getTime() + TEN_MINUTE_MS)
                },
                ...expected
            ];
            // @ts-expect-error groupVisitsOnMaps is private methode
            const actual = statsService.keepOneVisitByUserAndDate(visits);

            expect(actual).toEqual(expected);
            expect(actual).toHaveLength(2);
        });
    });

    describe("reduceUsersToUsersByStatus()", () => {
        const DEFAULT_USERS_BY_STATUS = {
            admin: 0,
            active: 0,
            idle: 0,
            inactive: 0
        };

        it("should increment admin", () => {
            const expected = DEFAULT_USERS_BY_STATUS.admin + 1;
            // @ts-expect-error: private method
            const actual = statsService.reduceUsersToUsersByStatus(
                { ...DEFAULT_USERS_BY_STATUS },
                // @ts-expect-error: partial object
                { roles: ["admin"] }
            ).admin;
            expect(actual).toEqual(expected);
        });

        it("should increment active", () => {
            mockIsUserActif.mockImplementationOnce(() => true);
            const expected = DEFAULT_USERS_BY_STATUS.active + 1;
            // @ts-expect-error: private method
            const actual = statsService.reduceUsersToUsersByStatus(
                { ...DEFAULT_USERS_BY_STATUS },
                // @ts-expect-error: partial object
                { roles: ["user"] }
            ).active;
            expect(actual).toEqual(expected);
        });

        it("should increment idle", () => {
            mockIsUserActif.mockImplementationOnce(() => false);
            const expected = DEFAULT_USERS_BY_STATUS.idle + 1;
            // @ts-expect-error: private method
            const actual = statsService.reduceUsersToUsersByStatus(
                { ...DEFAULT_USERS_BY_STATUS },
                // @ts-expect-error: partial object
                { roles: ["user"], active: true }
            ).idle;
            expect(actual).toEqual(expected);
        });

        it("should increment inactive", () => {
            mockIsUserActif.mockImplementationOnce(() => false);
            const expected = DEFAULT_USERS_BY_STATUS.inactive + 1;
            // @ts-expect-error: private method
            const actual = statsService.reduceUsersToUsersByStatus(
                { ...DEFAULT_USERS_BY_STATUS },
                // @ts-expect-error: partial object
                { roles: ["user"], active: false }
            ).inactive;
            expect(actual).toEqual(expected);
        });
    });

    describe("getUserCountByStatus()", () => {
        it("should return UsersByStatus with empty users", async () => {
            jest.spyOn(userRepository, "findAll").mockImplementationOnce(async () => []);
            const expected = { admin: 0, active: 0, idle: 0, inactive: 0 };
            const actual = await statsService.getUserCountByStatus();
            expect(actual).toEqual(expected);
        });

        it("should return UsersByStatus", async () => {
            jest.spyOn(userRepository, "findAll").mockImplementationOnce(async () => [{} as UserDbo]);
            const USERS_BY_STATUS = { admin: 1, active: 1, idle: 1, inactive: 1 };
            const expected = USERS_BY_STATUS;
            // @ts-expect-error: private method
            jest.spyOn(statsService, "reduceUsersToUsersByStatus").mockImplementationOnce(acc => USERS_BY_STATUS);
            const actual = await statsService.getUserCountByStatus();
            expect(actual).toEqual(expected);
        });
    });
});

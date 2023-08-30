const mockIsUserActif = jest.fn();

jest.mock("../../shared/helpers/UserHelper", () => {
    return {
        __esModule: true, // this property makes it work
        isUserActif: mockIsUserActif,
    };
});

import statsService from "./stats.service";
import userService from "../user/user.service";
import * as DateHelper from "../../shared/helpers/DateHelper";
import associationNameService from "../association-name/associationName.service";
import statsRepository from "./repositories/stats.repository";
import statsAssociationsVisitRepository from "./repositories/statsAssociationsVisit.repository";
import AssociationVisitEntity from "./entities/AssociationVisitEntity";
import userRepository from "../user/repositories/user.repository";
import UserDbo from "../user/repositories/dbo/UserDbo";
import { UserDto } from "dto";
import userAssociationVisitJoiner from "./joiners/UserAssociationVisitsJoiner";
import { UserWithAssociationVisitsEntity } from "./entities/UserWithAssociationVisitsEntity";
import { ObjectId } from "mongodb";

describe("StatsService", () => {
    describe("getNbUsersByRequestsOnPeriod()", () => {
        const mockFindAssociationVisitsOnPeriodGroupedByUsers = jest.spyOn(
            userAssociationVisitJoiner,
            "findAssociationVisitsOnPeriodGroupedByUsers",
        );

        const TODAY = new Date();
        const NB_REQUESTS = 2;
        const START = new Date(TODAY);
        START.setDate(START.getDate() + -1);
        const END = new Date(TODAY);
        END.setDate(END.getDate() + 1);

        const USERS_WITH_VISITS = [
            {
                _id: new ObjectId(1),
                associationVisits: [{}, {}, {}],
            },
            {
                _id: new ObjectId(2),
                associationVisits: [{}],
            },
            {
                _id: new ObjectId(3),
                associationVisits: [{}, {}, {}, {}],
            },
            {
                _id: new ObjectId(4),
                associationVisits: [{}, {}],
            },
        ] as UserWithAssociationVisitsEntity[];

        beforeEach(() => {
            mockFindAssociationVisitsOnPeriodGroupedByUsers.mockImplementationOnce(() =>
                Promise.resolve(USERS_WITH_VISITS),
            );
        });

        it("should call userAssociationVisitJoiner", async () => {
            const expected = [START, END];
            await statsService.getNbUsersByRequestsOnPeriod(START, END, NB_REQUESTS);
            expect(mockFindAssociationVisitsOnPeriodGroupedByUsers).toHaveBeenCalledWith(...expected);
        });

        it("should return result from repository", async () => {
            const expected = 3;
            const actual = await statsService.getNbUsersByRequestsOnPeriod(START, END, NB_REQUESTS);
            expect(actual).toBe(expected);
        });
    });

    describe("getMedianVisitsOnPeriod()", () => {
        const findGroupedByUserIdentifierOnPeriodMock = jest.spyOn(
            statsAssociationsVisitRepository,
            "findGroupedByUserIdentifierOnPeriod",
        );

        const TODAY = new Date();
        const START = new Date(TODAY);
        START.setDate(START.getDate() + -1);
        const END = new Date(TODAY);
        END.setDate(END.getDate() + 1);

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findGroupedByUserIdentifierOnPeriodMock.mockImplementationOnce((start, end) => Promise.resolve([]));
        });

        it("should call repository", async () => {
            const expected = [START, END];
            const actual = statsAssociationsVisitRepository.findGroupedByUserIdentifierOnPeriod;
            await statsService.getMedianVisitsOnPeriod(START, END);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        it("should call repository with includesAdmin", async () => {
            const expected = [START, END];
            const actual = statsAssociationsVisitRepository.findGroupedByUserIdentifierOnPeriod;
            await statsService.getMedianVisitsOnPeriod(START, END);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        it("should call repository", async () => {
            const expected = 0;
            const actual = await statsService.getMedianVisitsOnPeriod(START, END);
            expect(actual).toBe(expected);
        });
    });

    describe("getRequestsPerMonthByYear()", () => {
        const monthlyAvgRequestsOnPeriodMock = jest.spyOn(statsRepository, "countRequestsPerMonthByYear");

        const YEAR = 2022;
        const CURR_YEAR = new Date().getFullYear();
        const CURR_MONTH = new Date().getMonth();
        const mockedValue = [
            { _id: 1, nbOfRequests: 201 },
            { _id: 2, nbOfRequests: 21 },
            { _id: 10, nbOfRequests: 300 },
            { _id: 12, nbOfRequests: 1 },
        ];

        beforeAll(() => monthlyAvgRequestsOnPeriodMock.mockResolvedValue(mockedValue));
        afterAll(() => monthlyAvgRequestsOnPeriodMock.mockRestore());

        it("calls repository", async () => {
            const expected = [YEAR, false];
            const actual = statsRepository.countRequestsPerMonthByYear;
            await statsService.getRequestsPerMonthByYear(YEAR, false);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        it("calls repository with includesAdmin", async () => {
            const expected = [YEAR, true];
            const actual = statsRepository.countRequestsPerMonthByYear;
            await statsService.getRequestsPerMonthByYear(YEAR, true);
            expect(actual).toHaveBeenCalledWith(...expected);
        });

        describe.each`
            time         | year             | detail                                       | sum                     | avg
            ${"past"}    | ${CURR_YEAR - 1} | ${[201, 21, 0, 0, 0, 0, 0, 0, 0, 300, 0, 1]} | ${523}                  | ${523 / 12}
            ${"current"} | ${CURR_YEAR}     | ${Array(CURR_MONTH + 1).fill(5)}             | ${(CURR_MONTH + 1) * 5} | ${5}
            ${"future"}  | ${CURR_YEAR + 1} | ${[]}                                        | ${0}                    | ${0}
        `("returns correct value for $time year", ({ year, detail, sum, avg }) => {
            beforeEach(() => {
                if (year === CURR_YEAR)
                    monthlyAvgRequestsOnPeriodMock.mockResolvedValueOnce(
                        Array(CURR_MONTH + 1)
                            .fill(0)
                            .map((_, index) => ({
                                _id: index + 1,
                                nbOfRequests: 5,
                            })),
                    );
            });

            // TODO fix case current

            it("returns formatted detail", async () => {
                const expected = detail;
                const actual = (await statsService.getRequestsPerMonthByYear(year, false)).nb_requetes_par_mois;
                expect(actual).toStrictEqual(expected);
            });

            it("returns correct sum", async () => {
                const expected = sum;
                const actual = (await statsService.getRequestsPerMonthByYear(year, false)).somme_nb_requetes;
                expect(actual).toStrictEqual(expected);
            });

            it("returns correct average", async () => {
                const expected = avg;
                const actual = (await statsService.getRequestsPerMonthByYear(year, false)).nb_requetes_moyen;
                expect(actual).toStrictEqual(expected);
            });
        });
    });

    describe("getMonthlyUserNbByYear()", () => {
        const initCountMock = jest.spyOn(userService, "countTotalUsersOnDate");
        const getUsersMock = jest.spyOn(userService, "findByPeriod");
        const firstDayMock = jest.spyOn(DateHelper, "firstDayOfPeriod");
        const oneYearLaterMock = jest.spyOn(DateHelper, "oneYearAfterPeriod");

        const THIS_YEAR = new Date().getFullYear();
        const PAST_YEAR = THIS_YEAR - 1;
        const INIT_COUNT = 2;
        const EVOLUTION = [3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5];
        const FINAL_DATA = {
            nombres_utilisateurs_avant_annee: INIT_COUNT,
            evolution_nombres_utilisateurs: EVOLUTION,
        };
        const USER_DATA = [
            { signupAt: new Date(PAST_YEAR, 0, 23) },
            { signupAt: new Date(PAST_YEAR, 2, 3) },
            { signupAt: new Date(PAST_YEAR, 8, 16) },
        ];
        const FIRST_DAY_PERIOD = new Date(PAST_YEAR, 0, 1);
        const NEXT_DAY_PERIOD = new Date(PAST_YEAR + 1, 0, 0);

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
            await statsService.getMonthlyUserNbByYear(PAST_YEAR);
            expect(firstDayMock).toBeCalledWith(PAST_YEAR);
            expect(oneYearLaterMock).toBeCalledWith(PAST_YEAR);
        });

        it("should call init count with proper date", async () => {
            await statsService.getMonthlyUserNbByYear(PAST_YEAR);
            expect(initCountMock).toBeCalledWith(FIRST_DAY_PERIOD);
        });

        it("should get users from proper period", async () => {
            await statsService.getMonthlyUserNbByYear(PAST_YEAR);
            expect(getUsersMock).toBeCalledWith(FIRST_DAY_PERIOD, NEXT_DAY_PERIOD);
        });

        it("should return proper result with past year", async () => {
            const actual = await statsService.getMonthlyUserNbByYear(PAST_YEAR);
            const expected = FINAL_DATA;
            expect(actual).toEqual(expected);
        });

        it("returns no data in a future year", async () => {
            const actual = await statsService.getMonthlyUserNbByYear(THIS_YEAR + 1);
            const expected = {
                nombres_utilisateurs_avant_annee: INIT_COUNT,
                evolution_nombres_utilisateurs: [],
            };
            expect(actual).toEqual(expected);
        });
        it("returns no data in future months of current year", async () => {
            const actual = await statsService.getMonthlyUserNbByYear(THIS_YEAR);
            const THIS_MONTH = new Date().getMonth();
            const expected = {
                nombres_utilisateurs_avant_annee: INIT_COUNT,
                evolution_nombres_utilisateurs: EVOLUTION.slice(0, THIS_MONTH + 1),
            };
            expect(actual).toEqual(expected);
        });

        it("should not forget init count", async () => {
            const INIT_COUNT_ALT = 12;
            const diff = -INIT_COUNT + INIT_COUNT_ALT;
            initCountMock.mockResolvedValueOnce(INIT_COUNT_ALT);
            const FINAL_DATA_ALT = [];
            for (const [month, count] of Object.entries(FINAL_DATA.evolution_nombres_utilisateurs)) {
                FINAL_DATA_ALT[month] = count + diff;
            }
            const actual = await statsService.getMonthlyUserNbByYear(PAST_YEAR);
            const expected = {
                evolution_nombres_utilisateurs: FINAL_DATA_ALT,
                nombres_utilisateurs_avant_annee: INIT_COUNT_ALT,
            };
            expect(actual).toEqual(expected);
        });
    });

    describe("getTopAssociationsByPeriod()", () => {
        const TODAY = new Date();
        const END = new Date(Date.UTC(TODAY.getFullYear(), TODAY.getMonth(), 1));
        const START = new Date(Date.UTC(END.getFullYear() - 1, END.getMonth() + 1, 1));

        const findGroupedByAssociationIdentifierOnPeriodMock: jest.SpyInstance = jest.spyOn(
            statsAssociationsVisitRepository,
            "findGroupedByAssociationIdentifierOnPeriod",
        );
        const getNameFromIdentifierMock = jest.spyOn(associationNameService, "getNameFromIdentifier");
        const groupAssociationVisitsByAssociationMock: jest.SpyInstance = jest.spyOn(
            statsService,
            // @ts-expect-error groupAssociationVisitsByAssociation is private method
            "groupAssociationVisitsByAssociation",
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
                "Invalid Date",
            );
        });

        it("should throw error, start date is undefined", async () => {
            await expect(async () =>
                statsService.getTopAssociationsByPeriod(5, undefined as unknown as Date, END),
            ).rejects.toThrowError("Invalid Date");
        });

        it("should throw error, end date is invalid", async () => {
            const invalidDate = new Date("");

            await expect(async () =>
                statsService.getTopAssociationsByPeriod(5, START, invalidDate),
            ).rejects.toThrowError("Invalid Date");
        });

        it("should throw error, end date is undefined", async () => {
            await expect(async () =>
                statsService.getTopAssociationsByPeriod(5, START, undefined as unknown as Date),
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
                    fake: "data",
                },
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
                    visits: expected,
                },
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
                    visits: "Visits",
                },
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
                    visits: "Visits",
                },
                {
                    id: "ID1",
                    visits: "Visits",
                },
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
                    visits: 42,
                },
                {
                    name: "ID1",
                    visits: 1,
                },
            ];
            const DATA = [
                {
                    id: "ID1",
                    visits: { length: 1 },
                },
                {
                    id: "ID2",
                    visits: { length: 42 },
                },
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
                visits: 42,
            };
            const DATA = [
                {
                    id: "ID",
                    visits: { length: 42 },
                },
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
                { _id: SIREN, visits: ["BB"] },
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
                { _id: SIREN, visits: ["BB"] as unknown as AssociationVisitEntity[] },
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
                    visits: 1,
                },
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
                    visits: 1,
                },
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
                            visits: 1,
                        },
                    ],
                },
                rnaMap,
                sirenMap,
            );
            expect(sirenMap.get(SIREN)).toBe(expected);
            expect(rnaMap.get(RNA)).toBe(expected);
        });

        it("should getting all identifers of association", async () => {
            getGroupedIdentifiersMock.mockImplementationOnce(async () => ({
                rna: RNA,
                siren: SIREN,
            }));
            const sirenMap = new Map();
            const rnaMap = new Map();
            // @ts-expect-error groupVisitsOnMaps is private methode
            await statsService.groupVisitsOnMaps(
                {
                    _id: SIREN,
                    visits: [
                        {
                            visits: 1,
                        },
                    ],
                },
                rnaMap,
                sirenMap,
            );

            expect(getGroupedIdentifiersMock).toHaveBeenCalledWith(SIREN);
        });

        it("should add visits on all maps", async () => {
            getGroupedIdentifiersMock.mockImplementationOnce(async () => ({
                rna: RNA,
                siren: SIREN,
            }));
            const sirenMap = new Map();
            const rnaMap = new Map();
            const expected = {
                id: SIREN,
                visits: [
                    {
                        visits: 1,
                    },
                ],
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
                siren: SIREN,
            }));
            const sirenMap = new Map();
            const rnaMap = new Map();
            const expected = {
                id: SIREN,
                visits: [
                    {
                        visits: 1,
                    },
                ],
            };
            // @ts-expect-error groupVisitsOnMaps is private methode
            await statsService.groupVisitsOnMaps({ _id: SIREN, visits: expected.visits }, rnaMap, sirenMap);

            expect(sirenMap.get(SIREN)).toEqual(expected);
        });

        it("should add visits on rnaMap", async () => {
            getGroupedIdentifiersMock.mockImplementationOnce(async () => ({
                rna: RNA,
                siren: undefined,
            }));
            const sirenMap = new Map();
            const rnaMap = new Map();
            const expected = {
                id: RNA,
                visits: [
                    {
                        visits: 1,
                    },
                ],
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
                date: new Date(),
            };

            const visits = [
                {
                    userId: "USER_ID",
                    date: new Date(expected.date.getTime() + TEN_MINUTE_MS),
                },
                expected,
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
                    date: new Date(),
                },
                {
                    userId: "USER_ID_2",
                    date: new Date(),
                },
            ];

            const visits = [
                {
                    userId: "USER_ID",
                    date: new Date(expected[0].date.getTime() + TEN_MINUTE_MS),
                },
                ...expected,
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
            inactive: 0,
        };

        it("should increment admin", async () => {
            const expected = DEFAULT_USERS_BY_STATUS.admin + 1;
            // @ts-expect-error: private method
            const stats = await statsService.reduceUsersToUsersByStatus(
                Promise.resolve({ ...DEFAULT_USERS_BY_STATUS }),
                // @ts-expect-error: partial object
                { roles: ["admin"] },
            );
            const actual = stats.admin;
            expect(actual).toEqual(expected);
        });

        it("should increment active", async () => {
            mockIsUserActif.mockImplementationOnce(() => true);
            const expected = DEFAULT_USERS_BY_STATUS.active + 1;
            // @ts-expect-error: private method
            const stats = await statsService.reduceUsersToUsersByStatus(
                Promise.resolve({ ...DEFAULT_USERS_BY_STATUS }),
                // @ts-expect-error: partial object
                { roles: ["user"] },
            );

            const actual = stats.active;
            expect(actual).toEqual(expected);
        });

        it("should increment idle", async () => {
            mockIsUserActif.mockImplementationOnce(() => false);
            const expected = DEFAULT_USERS_BY_STATUS.idle + 1;
            // @ts-expect-error: private method
            const stats = await statsService.reduceUsersToUsersByStatus(
                Promise.resolve({ ...DEFAULT_USERS_BY_STATUS }),
                // @ts-expect-error: partial object
                { roles: ["user"], active: true },
            );

            const actual = stats.idle;
            expect(actual).toEqual(expected);
        });

        it("should increment inactive", async () => {
            mockIsUserActif.mockImplementationOnce(() => false);
            const expected = DEFAULT_USERS_BY_STATUS.inactive + 1;
            // @ts-expect-error: private method
            const stats = await statsService.reduceUsersToUsersByStatus(
                Promise.resolve({ ...DEFAULT_USERS_BY_STATUS }),
                // @ts-expect-error: partial object
                { roles: ["user"], active: false },
            );

            const actual = stats.inactive;
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

    describe("countUserAverageVisitsOnPeriod", () => {
        const computeMonthBetweenDatesMock: jest.SpyInstance = jest.spyOn(DateHelper, "computeMonthBetweenDates");
        let keepOneVisitByUserAndDateMock: jest.SpyInstance;
        let keepOneUserVisitByAssociationAndDate: jest.SpyInstance;

        beforeAll(() => {
            // I don't know why, but if I create a spy on describe (not in beforeAll) at some point the spy are destroyed by line 276 (mockRestore), I think!
            // @ts-expect-error: private method
            keepOneVisitByUserAndDateMock = jest.spyOn(statsService, "keepOneVisitByUserAndDate").mockResolvedValue([]);
            keepOneUserVisitByAssociationAndDate = jest
                // @ts-expect-error: private method
                .spyOn(statsService, "keepOneUserVisitByAssociationAndDate")
                // @ts-expect-error
                .mockResolvedValue([]);

            computeMonthBetweenDatesMock.mockReturnValue(1);
        });
        afterAll(() => {
            keepOneVisitByUserAndDateMock.mockRestore();
            keepOneUserVisitByAssociationAndDate.mockRestore();
            computeMonthBetweenDatesMock.mockRestore();
        });

        it("should call keepOneUserVisitByAssociationAndDate", async () => {
            const expected = [{ test: true }];
            const user = {
                id: "USER_ID",
                signupAt: new Date(2023, 0, 0),
                associationVisits: expected,
            } as unknown as UserWithAssociationVisitsEntity;
            const start = new Date(2023, 0, 5);
            const end = new Date(2024, 0, 0);

            keepOneUserVisitByAssociationAndDate.mockImplementationOnce(data => data);

            // @ts-expect-error: private method
            await statsService.countUserAverageVisitsOnPeriod(user, start, end);

            expect(keepOneUserVisitByAssociationAndDate).toBeCalledWith(expected);
        });

        it("should call computeMonthBetweenDates", async () => {
            const user = {
                id: "USER_ID",
                signupAt: new Date(2023, 0, 0),
                associationVisits: [{ test: true }],
            } as unknown as UserWithAssociationVisitsEntity;
            const start = new Date(2023, 0, 5);
            const end = new Date(2024, 0, 0);
            keepOneUserVisitByAssociationAndDate.mockImplementationOnce(data => data);

            // @ts-expect-error: private method
            await statsService.countUserAverageVisitsOnPeriod(user, start, end);

            expect(computeMonthBetweenDatesMock).toBeCalledWith(start, end);
        });

        it("should return average", async () => {
            const user = {
                id: "USER_ID",
                signupAt: new Date(2023, 0, 0),
                associationVisits: [{ visits: true }],
            } as unknown as UserDto;
            const start = new Date(2023, 0, 5);
            const end = new Date(2024, 0, 0);

            keepOneUserVisitByAssociationAndDate.mockImplementationOnce(data => data);

            // @ts-expect-error: private method
            const actual = await statsService.countUserAverageVisitsOnPeriod(user, start, end);

            expect(actual).toBe(1);
        });
    });

    describe("getUsersByRequest", () => {
        const findUsersMock = jest.spyOn(userAssociationVisitJoiner, "findAssociationVisitsOnPeriodGroupedByUsers");

        const countUserAverageVisitsOnPeriodMock: jest.SpyInstance = jest.spyOn(
            statsService,
            // @ts-ignore private methode
            "countUserAverageVisitsOnPeriod",
        );

        it("should call user find", async () => {
            findUsersMock.mockResolvedValueOnce([]);

            await statsService.getUsersByRequest();

            expect(findUsersMock).toBeCalledTimes(1);
        });

        it("should call countUserAverageVisitsOnPeriod", async () => {
            findUsersMock.mockResolvedValueOnce([{ fake: "user" } as unknown as UserWithAssociationVisitsEntity]);
            countUserAverageVisitsOnPeriodMock.mockResolvedValueOnce(1);

            await statsService.getUsersByRequest();

            expect(countUserAverageVisitsOnPeriodMock).toBeCalledTimes(1);
        });

        it("should return one on bound :0", async () => {
            findUsersMock.mockResolvedValueOnce([{ fake: "user" } as unknown as UserWithAssociationVisitsEntity]);
            countUserAverageVisitsOnPeriodMock.mockResolvedValueOnce(0.5);

            const actual = await statsService.getUsersByRequest();
            const expected = { ":0": 1, "1:10": 0, "11:20": 0, "21:30": 0, "31:": 0 };

            expect(actual).toEqual(expect.objectContaining(expected));
        });

        it("should return one on bound 1:10", async () => {
            findUsersMock.mockResolvedValueOnce([{ fake: "user" } as unknown as UserWithAssociationVisitsEntity]);
            countUserAverageVisitsOnPeriodMock.mockResolvedValueOnce(9);

            const actual = await statsService.getUsersByRequest();
            const expected = { ":0": 0, "1:10": 1, "11:20": 0, "21:30": 0, "31:": 0 };

            expect(actual).toEqual(expect.objectContaining(expected));
        });

        it("should return one on bound 11:20", async () => {
            findUsersMock.mockResolvedValueOnce([{ fake: "user" } as unknown as UserWithAssociationVisitsEntity]);
            countUserAverageVisitsOnPeriodMock.mockResolvedValueOnce(11);

            const actual = await statsService.getUsersByRequest();
            const expected = { ":0": 0, "1:10": 0, "11:20": 1, "21:30": 0, "31:": 0 };

            expect(actual).toEqual(expect.objectContaining(expected));
        });

        it("should return one on bound 21:30", async () => {
            findUsersMock.mockResolvedValueOnce([{ fake: "user" } as unknown as UserWithAssociationVisitsEntity]);
            countUserAverageVisitsOnPeriodMock.mockResolvedValueOnce(21);

            const actual = await statsService.getUsersByRequest();
            const expected = { ":0": 0, "1:10": 0, "11:20": 0, "21:30": 1, "31:": 0 };

            expect(actual).toEqual(expect.objectContaining(expected));
        });

        it("should return one on bound 31:", async () => {
            findUsersMock.mockResolvedValueOnce([{ fake: "user" } as unknown as UserWithAssociationVisitsEntity]);
            countUserAverageVisitsOnPeriodMock.mockResolvedValueOnce(31);

            const actual = await statsService.getUsersByRequest();
            const expected = { ":0": 0, "1:10": 0, "11:20": 0, "21:30": 0, "31:": 1 };

            expect(actual).toEqual(expect.objectContaining(expected));
        });
    });

    describe("getExporterEmails", () => {
        const mailToLog = email => ({ meta: { req: { user: { email } } } });
        const LOGS = [{ meta: { req: { user: { email: "a@b.c" } } } }, { meta: { req: { user: { email: "d@e.f" } } } }];
        const repoMock = jest
            .spyOn(statsRepository, "getLogsWithRegexUrl")
            // @ts-expect-error mock
            .mockReturnValue({ toArray: () => Promise.resolve(LOGS) });
        const RES = ["a@b.c", "d@e.f"];

        afterAll(() => repoMock.mockRestore());

        it("gets proper logs from repository", async () => {
            await statsService.getExportersEmails();
            expect(repoMock).toBeCalledWith(/extract-data$/);
        });

        it("returns emails from logs", async () => {
            const expected = RES;
            const actual = await statsService.getExportersEmails();
            expect(actual).toEqual(expected);
        });

        it("removes duplicates", async () => {
            const expected = RES;
            // @ts-expect-error mock
            repoMock.mockReturnValueOnce({ toArray: () => Promise.resolve([...LOGS, mailToLog("a@b.c")]) });
            const actual = await statsService.getExportersEmails();
            expect(actual).toEqual(expected);
        });

        it("removes undefined", async () => {
            const expected = RES;
            // @ts-expect-error mock
            repoMock.mockReturnValueOnce({ toArray: () => Promise.resolve([...LOGS, mailToLog("a@b.c")]) });
            const actual = await statsService.getExportersEmails();
            expect(actual).toEqual(expected);
        });
    });
});

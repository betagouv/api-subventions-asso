import { RNA_STR, SIREN_STR } from "../../../tests/__fixtures__/association.fixture";
import logsPort from "../../dataProviders/db/stats/logs.port";
import statsAssociationsVisitPort from "../../dataProviders/db/stats/statsAssociationsVisit.port";
import { CONSUMER_USER } from "../user/__fixtures__/user.fixture";
import userCrudService from "../user/services/crud/user.crud.service";
import RouteTypesEnum from "./@types/RouteTypesEnum";
import statsService from "./stats.service";
import { FindCursor, ObjectId } from "mongodb";

jest.mocked("../user/services/crud/user.crud.service");
jest.mock("../../dataProviders/db/stats/statsAssociationsVisit.port");
jest.mock("../../dataProviders/db/stats/logs.port");

describe("StatsService", () => {
    // pass-through methods
    describe.each`
        methodToTest                       | methodToCall                                    | nbArgs
        ${"addAssociationVisit"}           | ${statsAssociationsVisitPort.add}               | ${1}
        ${"getUserLastSearchDate"}         | ${statsAssociationsVisitPort.getLastSearchDate} | ${1}
        ${"getAllVisitsUser"}              | ${statsAssociationsVisitPort.findByUserId}      | ${1}
        ${"getAllLogUser"}                 | ${logsPort.findByEmail}                         | ${1}
        ${"getAllLogUser"}                 | ${logsPort.findByEmail}                         | ${1}
        ${"getAssociationsVisitsOnPeriod"} | ${statsAssociationsVisitPort.findOnPeriod}      | ${2}
    `("$methodToTest passes through $methodToCall", ({ methodToTest, methodToCall, nbArgs }) => {
        const ARGS = ["a", "b"].slice(0, nbArgs);
        it("calls methodToCall", async () => {
            await statsService[methodToTest](...ARGS);
            expect(methodToCall).toHaveBeenCalledWith(...ARGS);
        });

        it("returns result from methodToCall", async () => {
            const expected = "TOTO";
            jest.mocked(methodToCall).mockResolvedValue(expected);
            const actual = await statsService[methodToTest](...ARGS);
            expect(actual).toEqual(expected);
        });
    });

    describe("getAnonymizedLogsOnPeriod", () => {
        const ID_STRING = "123456789012345678901234";
        const LOG = {
            meta: {
                req: {
                    body: {
                        email: "toto@email.com",
                        firstName: "Toto",
                        lastName: "Tata",
                        phoneNumber: "0123456789",
                    },
                    user: { _id: ID_STRING },
                },
            },
        };
        const START = new Date("1955-06-22");
        const END = new Date("1985-06-22");

        beforeEach(() => {
            jest.mocked(logsPort.getLogsOnPeriod).mockReturnValue([LOG] as unknown as FindCursor);
        });

        it("calls port", () => {
            statsService.getAnonymizedLogsOnPeriod(START, END);
            expect(logsPort.getLogsOnPeriod).toHaveBeenCalledWith(START, END);
        });

        it.each`
            property
            ${"email"}
            ${"firstName"}
            ${"lastName"}
            ${"phoneNumber"}
        `("deletes $arg", ({ property }) => {
            const actual = statsService.getAnonymizedLogsOnPeriod(START, END)[0].meta.req.body[property];
            expect(actual).toBeUndefined();
        });

        it("sets user id as ObjectId", () => {
            const expected = new ObjectId(ID_STRING);
            const req = statsService.getAnonymizedLogsOnPeriod(START, END)[0].meta.req;
            const actual = req.userId;
            expect(actual).toEqual(expected);
        });

        it("removes user's properties", () => {
            const actual = statsService.getAnonymizedLogsOnPeriod(START, END)[0].meta.req.user;
            expect(actual).toBeUndefined();
        });
    });

    describe("API CONSUMPTION PART", () => {
        const CONSUMER_1 = { ...CONSUMER_USER };
        const CONSUMER_2 = {
            ...CONSUMER_USER,
            _id: new ObjectId("6995dc65469048e843a1d4ec"),
            email: "consumer.2@beta.gouv.fr",
        };
        const CONSUMPTIONS: {
            userId: string;
            year: string;
            month: string;
            routes: Partial<Record<RouteTypesEnum, string[]>>;
        }[] = [
            {
                userId: CONSUMER_1._id.toString(),
                year: "2025",
                month: "1",
                routes: {
                    [RouteTypesEnum.ASSOCIATION]: ["/association/RNA", "/association/RNA/subventions"],
                },
            },
            {
                userId: CONSUMER_2._id.toString(),
                year: "2025",
                month: "4",
                routes: {
                    [RouteTypesEnum.ASSOCIATION]: ["/association/RNA", "/association/RNA/subventions"],
                },
            },
            {
                userId: CONSUMER_1._id.toString(),
                year: "2025",
                month: "7",
                routes: {
                    [RouteTypesEnum.ASSOCIATION]: ["/association/RNA/subventions"],
                    [RouteTypesEnum.SEARCH]: ["/search/associations/RNA"],
                },
            },
            {
                userId: CONSUMER_1._id.toString(),
                year: "2026",
                month: "1",
                routes: {
                    [RouteTypesEnum.ASSOCIATION]: ["/association/SIREN", "/association/SIREN/grants/v2"],
                },
            },
            {
                userId: CONSUMER_2._id.toString(),
                year: "2026",
                month: "3",
                routes: {
                    [RouteTypesEnum.ASSOCIATION]: ["/association/SIREN/grants/v2"],
                    [RouteTypesEnum.ESTABLISHMENT]: ["/etablissement/SIRET"],
                },
            },
            {
                userId: CONSUMER_2._id.toString(),
                year: "2026",
                month: "4",
                routes: {
                    [RouteTypesEnum.ASSOCIATION]: ["/association/SIREN/grants/v2"],
                    [RouteTypesEnum.SEARCH]: ["/search/associations/SIREN"],
                },
            },
        ];

        describe("getConsumersConsumption", () => {
            let mockFormatConsumption: jest.SpyInstance;
            const FORMATTED_CONSUMPTION = {
                [CONSUMER_1._id.toString()]: { "2025": { "1": { association: { "/association/RNA": 12 } } } },
            };
            const CONSUMER_CONSUMPTION = {
                [CONSUMER_1.email]: FORMATTED_CONSUMPTION[CONSUMER_1._id.toString()],
            };

            beforeAll(() => {
                jest.spyOn(userCrudService, "getConsumers").mockResolvedValue([CONSUMER_USER]);
            });

            beforeEach(() => {
                mockFormatConsumption = jest
                    // @ts-expect-error: mock private method
                    .spyOn(statsService, "formatConsumption")
                    // @ts-expect-error: mock private method
                    .mockReturnValue(FORMATTED_CONSUMPTION);
            });

            beforeAll(() => jest.spyOn(logsPort, "getConsumption").mockResolvedValue(CONSUMPTIONS));

            it("fetch consumer users", async () => {
                await statsService.getConsumersConsumption();
                expect(userCrudService.getConsumers).toHaveBeenCalledTimes(1);
            });

            it("calls logPort.getUsersUrlByYear()", async () => {
                await statsService.getConsumersConsumption();
                expect(logsPort.getConsumption).toHaveBeenCalledWith([CONSUMER_USER._id.toString()]);
            });

            it("format consumption", async () => {
                await statsService.getConsumersConsumption();
                expect(mockFormatConsumption).toHaveBeenCalledWith(CONSUMPTIONS);
            });

            it("returns consumer consumption", async () => {
                const expected = CONSUMER_CONSUMPTION;
                const actual = await statsService.getConsumersConsumption();
                expect(actual).toEqual(expected);
            });
        });

        describe("groupConsumptionsByUser", () => {
            const USER_ID_1 = "69945bc7cc6f1ecb0bc28f04";
            const USER_ID_2 = "69945bd153bf6718e023a28e";

            const CONSUMPTIONS = [
                { userId: USER_ID_1, year: 2025, month: 6, routes: [] },
                { userId: USER_ID_1, year: 2025, month: 8, routes: [] },
                { userId: USER_ID_2, year: 2025, month: 2, routes: [] },
                { userId: USER_ID_2, year: 2026, month: 2, routes: [] },
            ];

            it("groups consumptions by user id", () => {
                const expected = {
                    [USER_ID_1]: [
                        { year: 2025, month: 6, routes: [] },
                        { year: 2025, month: 8, routes: [] },
                    ],
                    [USER_ID_2]: [
                        { year: 2025, month: 2, routes: [] },
                        { year: 2026, month: 2, routes: [] },
                    ],
                };
                // @ts-expect-error: test private method
                const actual = statsService.groupConsumptionsByUser(CONSUMPTIONS);
                expect(actual).toEqual(expected);
            });
        });

        describe("formatConsumption", () => {
            let mockGroupConsumptionsByUser: jest.SpyInstance,
                mockGroupUserConsumptionsByYear: jest.SpyInstance,
                mockComputeSubRouteStats: jest.SpyInstance;

            beforeEach(() => {
                mockGroupConsumptionsByUser = jest
                    // @ts-expect-error: mock private method
                    .spyOn(statsService, "groupConsumptionsByUser")
                    // @ts-expect-error: mock private method
                    .mockReturnValue({
                        [CONSUMER_1._id.toString()]: { year: "2025", month: "1", routes: ["/association/RNA"] },
                    });
                mockGroupUserConsumptionsByYear = jest
                    // @ts-expect-error: mock private method
                    .spyOn(statsService, "groupUserConsumptionsByYear")
                    // @ts-expect-error: mock private method
                    .mockReturnValue({ "2025": [{ month: "1", routes: { association: ["/association/RNA"] } }] });
                mockComputeSubRouteStats = jest
                    // @ts-expect-error: mock private method
                    .spyOn(statsService, "computeSubRouteStats")
                    // @ts-expect-error: mock private method
                    .mockReturnValue({ "1": { association: { "/association/:id": 12 } } });
            });

            afterAll(() =>
                [mockGroupConsumptionsByUser, mockGroupUserConsumptionsByYear, mockComputeSubRouteStats].forEach(mock =>
                    mock.mockRestore(),
                ),
            );

            it("returns formated stats", () => {
                // @ts-expect-error: test private method
                const actual = statsService.formatConsumption(CONSUMPTIONS);
                expect(actual).toMatchSnapshot();
            });
        });

        describe("computeSubRouteStats", () => {
            const REGEXP_MAP = new Map([
                ["/association", new RegExp("^/association/.*[^/]")],
                ["/association/:id/subventions", new RegExp("^/association/.*[^/]/subventions")],
            ]);
            let mockGetRouteRegExpMap, mockGetRouteStatBuilder: jest.SpyInstance;
            const ASSO_ROUTE_STAT = { foo: { bar: 35 } };
            const SEARCH_ROUTE_STAT = { faa: { baz: 12 } };
            const mockAssoBuilder = jest.fn(_type => ASSO_ROUTE_STAT);
            const mockSearchBuilder = jest.fn(_type => SEARCH_ROUTE_STAT);

            beforeEach(() => {
                mockGetRouteRegExpMap = jest
                    // @ts-expect-error: mock private method
                    .spyOn(statsService, "getRouteRegExpMap")
                    // @ts-expect-error: mock private method
                    .mockReturnValue(REGEXP_MAP);
                mockGetRouteStatBuilder = jest
                    // @ts-expect-error: mock private method
                    .spyOn(statsService, "getRouteStatBuilder");

                mockGetRouteStatBuilder.mockReturnValueOnce(mockAssoBuilder);
                mockGetRouteStatBuilder.mockReturnValueOnce(mockSearchBuilder);
            });

            afterEach(() => {
                mockAssoBuilder.mockClear();
                mockSearchBuilder.mockClear();
            });

            afterAll(() => {
                [mockGetRouteRegExpMap, mockGetRouteStatBuilder].forEach(mock => mock.mockRestore());
            });

            it("aggregate stats for each sub route", () => {
                expect(
                    // @ts-expect-error: test private method
                    statsService.computeSubRouteStats({
                        [RouteTypesEnum.ASSOCIATION]: ["/association/RNA"],
                        [RouteTypesEnum.SEARCH]: ["/search/associations/SIREN"],
                    }),
                ).toEqual({
                    [RouteTypesEnum.ASSOCIATION]: ASSO_ROUTE_STAT,
                    [RouteTypesEnum.SEARCH]: SEARCH_ROUTE_STAT,
                });
            });
        });

        describe("getRouteStatBuilder", () => {
            const REGEXP_MAP = new Map([
                ["/association", new RegExp("/association")],
                ["/search", new RegExp("/search")],
            ]);

            it("returns a function", () => {
                // @ts-expect-error: test private method
                const actual = statsService.getRouteStatBuilder([]);
                expect(actual).toBeInstanceOf(Function);
            });

            it("returns a builder that builds stats", () => {
                const expected = {
                    "/association": 2,
                    "/search": 1,
                };

                // @ts-expect-error: test private method
                const builder = statsService.getRouteStatBuilder(REGEXP_MAP);
                const actual = builder(["/association", "/search", "/association"]);
                expect(actual).toEqual(expected);
            });
        });

        describe("getRouteRegExpMap", () => {
            // @ts-expect-error: spy on private method
            const spyAssoRegExp = jest.spyOn(statsService, "getAssociationRegExpMap");
            // @ts-expect-error: spy on private method
            const spyEstabRegExp = jest.spyOn(statsService, "getEstablishmentRegExpMap");
            // @ts-expect-error: spy on private method
            const spySearchRegExp = jest.spyOn(statsService, "getSearchRegExpMap");
            // @ts-expect-error: spy on private method
            const spyDepositRegExp = jest.spyOn(statsService, "getDepositScdlProcessRegExpMap");
            // @ts-expect-error: spy on private method
            const spyOpenDataRegExp = jest.spyOn(statsService, "getOpenDataRegExpMap");
            // @ts-expect-error: spy on private method
            const spyDocumentRegExp = jest.spyOn(statsService, "getDocumentRegExpMap");

            afterEach(() => {
                [
                    spyAssoRegExp,
                    spyEstabRegExp,
                    spySearchRegExp,
                    spyDepositRegExp,
                    spyOpenDataRegExp,
                    spyDocumentRegExp,
                ].forEach((spy: jest.SpyInstance) => spy.mockClear());
            });

            afterAll(() => {
                [
                    spyAssoRegExp,
                    spyEstabRegExp,
                    spySearchRegExp,
                    spyDepositRegExp,
                    spyOpenDataRegExp,
                    spyDocumentRegExp,
                ].forEach((spy: jest.SpyInstance) => spy.mockRestore());
            });

            it.each([
                { type: "association", spy: spyAssoRegExp },
                { type: "etablissement", spy: spyEstabRegExp },
                { type: "search", spy: spySearchRegExp },
                { type: "parcours-depot", spy: spyDepositRegExp },
                { type: "open-data", spy: spyOpenDataRegExp },
                { type: "document", spy: spyDocumentRegExp },
            ])("returns regexp map based for $type", ({ type, spy }) => {
                // @ts-expect-error: test private method
                statsService.getRouteRegExpMap(type);
                expect(spy).toHaveBeenCalled();
            });

            it("throws error if type does not match any possible type", () => {
                const TYPE = "wrong type";
                // @ts-expect-error: test private method
                expect(() => statsService.getRouteRegExpMap(TYPE)).toThrow(`No RegExp Map for the route type ${TYPE}`);
            });
        });

        /**
         * Test RegExp more than function implementation
         */
        describe("getAssociationRegExpMap", () => {
            const URLS = [
                `/association/${RNA_STR}`,
                `/association/${SIREN_STR}/subventions`,
                `/association/${SIREN_STR}/versements`,
                `/association/${SIREN_STR}/paiements`,
                `/association/${SIREN_STR}/applications`,
                `/association/${SIREN_STR}/grants`,
                `/association/${SIREN_STR}/grants/v2`,
                `/association/${SIREN_STR}/grants/csv`,
                `/association/${SIREN_STR}/raw-grants`,
                `/association/${SIREN_STR}/documents`,
                `/association/${SIREN_STR}/etablissements`,
            ];

            it("returns regexp map", () => {
                // @ts-expect-error: test private method
                const actual = statsService.getAssociationRegExpMap();
                expect(actual).toMatchSnapshot();
            });

            describe("returns regexp map that", () => {
                // @ts-expect-error: private method
                const REGEXP_MAP = statsService.getAssociationRegExpMap();
                const REGEXP_TEST = [
                    { route: URLS[0], regexp: REGEXP_MAP.get("/association/:id") as RegExp },
                    { route: URLS[1], regexp: REGEXP_MAP.get("/association/:id/subventions") as RegExp },
                    { route: URLS[2], regexp: REGEXP_MAP.get("/association/:id/versements") as RegExp },
                    { route: URLS[3], regexp: REGEXP_MAP.get("/association/:id/paiements") as RegExp },
                    { route: URLS[4], regexp: REGEXP_MAP.get("/association/:id/applications") as RegExp },
                    { route: URLS[5], regexp: REGEXP_MAP.get("/association/:id/grants") as RegExp },
                    { route: URLS[6], regexp: REGEXP_MAP.get("/association/:id/grants/v2") as RegExp },
                    { route: URLS[7], regexp: REGEXP_MAP.get("/association/:id/grants/csv") as RegExp },
                    { route: URLS[8], regexp: REGEXP_MAP.get("/association/:id/raw-grants") as RegExp },
                    { route: URLS[9], regexp: REGEXP_MAP.get("/association/:id/documents") as RegExp },
                    { route: URLS[10], regexp: REGEXP_MAP.get("/association/:id/etablissements") as RegExp },
                ];

                it.each(URLS)("contains only one regex that validate route %s", url => {
                    const expected = 1;
                    let actual = 0;
                    for (const [_routeName, regexp] of REGEXP_MAP) {
                        if (regexp.test(url)) actual++;
                    }
                    expect(actual).toEqual(expected);
                });

                it.each(REGEXP_TEST)("validates route $route", ({ route, regexp }) => {
                    const expected = true;
                    const actual = regexp.test(route);
                    expect(actual).toEqual(expected);
                });
            });
        });

        /**
         * Test RegExp more than function implementation
         */
        describe("getEstablishmentRegExpMap", () => {
            const URLS = [
                `/etablissement/${RNA_STR}`,
                `/etablissement/${SIREN_STR}/subventions`,
                `/etablissement/${SIREN_STR}/versements`,
                `/etablissement/${SIREN_STR}/paiements`,
                `/etablissement/${SIREN_STR}/applications`,
                `/etablissement/${SIREN_STR}/grants`,
                `/etablissement/${SIREN_STR}/grants/v2`,
                `/etablissement/${SIREN_STR}/grants/csv`,
                `/etablissement/${SIREN_STR}/documents`,
                `/etablissement/${SIREN_STR}/documents/rib`,
            ];

            it("returns regexp map", () => {
                // @ts-expect-error: test private method
                const actual = statsService.getEstablishmentRegExpMap();
                expect(actual).toMatchSnapshot();
            });

            describe("returns regexp map that", () => {
                // @ts-expect-error: private method
                const REGEXP_MAP = statsService.getEstablishmentRegExpMap();
                const REGEXP_TEST = [
                    { route: URLS[0], regexp: REGEXP_MAP.get("/etablissement/:id") as RegExp },
                    { route: URLS[1], regexp: REGEXP_MAP.get("/etablissement/:id/subventions") as RegExp },
                    { route: URLS[2], regexp: REGEXP_MAP.get("/etablissement/:id/versements") as RegExp },
                    { route: URLS[3], regexp: REGEXP_MAP.get("/etablissement/:id/paiements") as RegExp },
                    { route: URLS[4], regexp: REGEXP_MAP.get("/etablissement/:id/applications") as RegExp },
                    { route: URLS[5], regexp: REGEXP_MAP.get("/etablissement/:id/grants") as RegExp },
                    { route: URLS[6], regexp: REGEXP_MAP.get("/etablissement/:id/grants/v2") as RegExp },
                    { route: URLS[7], regexp: REGEXP_MAP.get("/etablissement/:id/grants/csv") as RegExp },
                    { route: URLS[8], regexp: REGEXP_MAP.get("/etablissement/:id/documents") as RegExp },
                    { route: URLS[9], regexp: REGEXP_MAP.get("/etablissement/:id/documents/rib") as RegExp },
                ];

                it.each(URLS)("contains only one regex that validate route %s", url => {
                    const expected = 1;
                    let actual = 0;
                    for (const [_routeName, regexp] of REGEXP_MAP) {
                        if (regexp.test(url)) actual++;
                    }
                    expect(actual).toEqual(expected);
                });

                it.each(REGEXP_TEST)("validates route $route", ({ route, regexp }) => {
                    const expected = true;
                    const actual = regexp.test(route);
                    expect(actual).toEqual(expected);
                });
            });
        });

        /**
         * Test RegExp more than function implementation
         */
        describe("getSearchRegExpMap", () => {
            const URLS = [`/search/associations/${RNA_STR}`];

            it("returns regexp map", () => {
                // @ts-expect-error: test private method
                const actual = statsService.getSearchRegExpMap();
                expect(actual).toMatchSnapshot();
            });

            describe("returns regexp map that", () => {
                // @ts-expect-error: private method
                const REGEXP_MAP = statsService.getSearchRegExpMap();
                const REGEXP_TEST = [
                    { route: URLS[0], regexp: REGEXP_MAP.get("/search/associations/:input") as RegExp },
                ];

                it.each(URLS)("contains only one regex that validate route", url => {
                    const expected = 1;
                    let actual = 0;
                    for (const [_routeName, regexp] of REGEXP_MAP) {
                        if (regexp.test(url)) actual++;
                    }
                    expect(actual).toEqual(expected);
                });

                it.each(REGEXP_TEST)("validates route $route", ({ route, regexp }) => {
                    const expected = true;
                    const actual = regexp.test(route);
                    expect(actual).toEqual(expected);
                });
            });
        });
        /**
         * Test RegExp more than function implementation
         */
        describe("getOpenDataRegExpMap", () => {
            const URLS = [
                `/document/downloads`,
                `/document/downloads/${SIREN_STR}`,
                "/document/xyz-document-dauphin-id",
            ];

            it("returns regexp map", () => {
                // @ts-expect-error: test private method
                const actual = statsService.getDocumentRegExpMap();
                expect(actual).toMatchSnapshot();
            });

            describe("returns regexp map that", () => {
                // @ts-expect-error: private method
                const REGEXP_MAP = statsService.getDocumentRegExpMap();
                const REGEXP_TEST = [
                    { route: URLS[0], regexp: REGEXP_MAP.get("/document/downloads") as RegExp },
                    { route: URLS[1], regexp: REGEXP_MAP.get("/document/downloads/:id") as RegExp },
                    { route: URLS[2], regexp: REGEXP_MAP.get("/document/:id") as RegExp },
                ];

                it.each(URLS)("contains only one regex that validate route", url => {
                    const expected = 1;
                    let actual = 0;
                    for (const [_routeName, regexp] of REGEXP_MAP) {
                        if (regexp.test(url)) actual++;
                    }
                    expect(actual).toEqual(expected);
                });

                it.each(REGEXP_TEST)("validates route $route", ({ route, regexp }) => {
                    const expected = true;
                    const actual = regexp.test(route);
                    expect(actual).toEqual(expected);
                });
            });
        });
        /**
         * Test RegExp more than function implementation
         */
        describe("getDepositScdlProcessRegExpMap", () => {
            const URLS = [
                `/parcours-depot`,
                `/parcours-depot/donnees-existantes`,
                "/parcours-depot/fichier-depose/url-de-telechargement",
                "/parcours-depot/validation-fichier-scdl",
                `/parcours-depot/depot-fichier-scdl`,
            ];

            it("returns regexp map", () => {
                // @ts-expect-error: test private method
                const actual = statsService.getDepositScdlProcessRegExpMap();
                expect(actual).toMatchSnapshot();
            });

            describe("returns regexp map that", () => {
                // @ts-expect-error: private method
                const REGEXP_MAP = statsService.getDepositScdlProcessRegExpMap();
                const REGEXP_TEST = [
                    { route: URLS[0], regexp: REGEXP_MAP.get("/parcours-depot") as RegExp },
                    { route: URLS[1], regexp: REGEXP_MAP.get("/parcours-depot/donnees-existantes") as RegExp },
                    {
                        route: URLS[2],
                        regexp: REGEXP_MAP.get("/parcours-depot/fichier-depose/url-de-telechargement") as RegExp,
                    },
                    { route: URLS[3], regexp: REGEXP_MAP.get("/parcours-depot/validation-fichier-scdl") as RegExp },
                    { route: URLS[4], regexp: REGEXP_MAP.get("/parcours-depot/depot-fichier-scdl") as RegExp },
                ];

                it.each(URLS)("contains only one regex that validate route", url => {
                    const expected = 1;
                    let actual = 0;
                    for (const [_routeName, regexp] of REGEXP_MAP) {
                        if (regexp.test(url)) actual++;
                    }
                    expect(actual).toEqual(expected);
                });

                it.each(REGEXP_TEST)("validates route $route", ({ route, regexp }) => {
                    const expected = true;
                    const actual = regexp.test(route);
                    expect(actual).toEqual(expected);
                });
            });
        });
    });
});

import axios from "axios";
import configurationsService from "../../configurations/configurations.service";
import DauphinDtoAdapter from "./adapters/DauphinDtoAdapter";
import dauphinService from "./dauphin.service";
import dauhpinGisproRepository from "./repositories/dauphin-gispro.repository";

jest.mock("axios", () => ({
    post: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

const SIRET = "12345678912345";

jest.mock("./../../../configurations/apis.conf", () => ({
    DAUPHIN_USERNAME: "DAUPHIN_USERNAME",
    DAUPHIN_PASSWORD: "DAUPHIN_PASSWORD",
}));

describe("Dauphin Service", () => {
    const TOKEN = "FAKE_TOKEN";
    const mockUpsert = jest.spyOn(dauhpinGisproRepository, "upsert");

    beforeAll(() => {
        // @ts-expect-error: mock
        mockUpsert.mockImplementation(() => Promise.resolve());
    });

    const DATA = [{ a: true }, { b: true }];

    beforeEach(() => {
        mockedAxios.post.mockImplementation(async (url, search, headers) => ({
            data: {
                hits: {
                    total: DATA.length,
                    hits: DATA,
                },
            },
        }));
    });

    describe("getDemandeSubventionBySiret", () => {
        const mockFindBySiret = jest.spyOn(dauhpinGisproRepository, "findBySiret");
        const mockToDemandeSubvention = jest.spyOn(DauphinDtoAdapter, "toDemandeSubvention");

        afterEach(() => mockToDemandeSubvention.mockReset());

        it("should return subventions", async () => {
            const APPLICATION_ENTITIES = [{ id: "A" }, { id: "B" }];
            const expected = APPLICATION_ENTITIES;
            // @ts-expect-error: mock return value
            mockFindBySiret.mockImplementationOnce(async () => APPLICATION_ENTITIES);
            // @ts-expect-error: mock return value
            mockToDemandeSubvention.mockImplementation(data => data);

            const actual = await dauphinService.getDemandeSubventionBySiret(SIRET);

            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        const findBySirenMock = jest.spyOn(dauhpinGisproRepository, "findBySiren");
        const mockToDemandeSubvention = jest.spyOn(DauphinDtoAdapter, "toDemandeSubvention");

        it("should return subventions", async () => {
            const expected = [{ fake: "data" }];
            // @ts-expect-error: mock return value
            findBySirenMock.mockImplementationOnce(async () => expected);
            // @ts-expect-error: mock return value
            mockToDemandeSubvention.mockImplementationOnce(data => data);
            const actual = await dauphinService.getDemandeSubventionBySiren("FAKE_SIREN");
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionByRna", () => {
        it("should return null", async () => {
            const expected = null;
            const actual = await dauphinService.getDemandeSubventionByRna();
            expect(expected).toBe(actual);
        });
    });

    describe("fetchAndSaveApplicationsFromDate", () => {
        // @ts-expect-error: private method
        const mockGetAuthToken = jest.spyOn(dauphinService, "getAuthToken");
        // @ts-expect-error: private method
        const mockGetApplicationsFromDate = jest.spyOn(dauphinService, "persistApplicationsFromDate");

        const mocks = [mockGetAuthToken, mockGetApplicationsFromDate];

        beforeEach(() => {
            // @ts-expect-error: mock
            mockGetAuthToken.mockImplementation(async () => TOKEN);
            // @ts-expect-error: mock
            mockGetApplicationsFromDate.mockImplementation(() => []);
        });

        afterEach(() => mocks.forEach(mock => mock.mockReset()));

        afterAll(() => mocks.forEach(mock => mock.mockRestore()));

        it("should call getAuthToken", async () => {
            await dauphinService.fetchAndSaveApplicationsFromDate(new Date());
            expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
        });

        it("should call persistApplicationsFromDate", async () => {
            await dauphinService.fetchAndSaveApplicationsFromDate(new Date());
            expect(mockGetApplicationsFromDate).toHaveBeenCalledTimes(1);
        });
    });

    describe("persistApplicationsFromDate", () => {
        // @ts-expect-error private method
        const mockBuildSearchHeader = jest.spyOn(dauphinService, "buildSearchHeader");
        // @ts-expect-error private method
        const mockBuildFetchFromDateQuery = jest.spyOn(dauphinService, "buildFetchFromDateQuery");
        // @ts-expect-error private method
        const mockFormatAndReturnDto = jest.spyOn(dauphinService, "formatAndReturnDto");
        // @ts-expect-error: private method
        const mockSaveApplicationsInCache = jest.spyOn(dauphinService, "saveApplicationsInCache");

        const mocks = [
            mockBuildSearchHeader,
            mockBuildFetchFromDateQuery,
            mockFormatAndReturnDto,
            mockSaveApplicationsInCache,
        ];

        beforeEach(() => {
            //@ts-expect-error: mock
            mockBuildSearchHeader.mockImplementation(() => ({ headers: {} }));
            mockBuildFetchFromDateQuery.mockImplementation(jest.fn());
            //@ts-expect-error: mock
            mockFormatAndReturnDto.mockImplementation(jest.fn(application => application));
        });

        afterEach(() => {
            mocks.map(mock => mock.mockReset());
        });

        afterAll(() => mocks.map(mock => mock.mockRestore()));

        it("should call buildFetchFromDateQuery", async () => {
            const DATE = new Date();
            // @ts-expect-error getDauphinSubventions is private
            await dauphinService.persistApplicationsFromDate(TOKEN, DATE);
            expect(mockBuildFetchFromDateQuery).toHaveBeenCalledWith(DATE);
        });

        it("should build headers from token", async () => {
            const expected = TOKEN;
            // @ts-expect-error getDauphinSubventions is private
            await dauphinService.persistApplicationsFromDate(TOKEN, new Date());
            expect(mockBuildSearchHeader).toHaveBeenCalledWith(expected);
        });

        it("should call axios with args", async () => {
            const DATE = new Date();
            // @ts-expect-error getDauphinSubventions is private
            await dauphinService.persistApplicationsFromDate(TOKEN, DATE);
            // @ts-expect-error: mock
            expect(axios.post.mock.calls[0]).toMatchSnapshot();
        });

        it("should call mockSaveApplicationsInCache", async () => {
            // @ts-expect-error getDauphinSubventions is private
            await dauphinService.persistApplicationsFromDate(TOKEN, new Date());
            expect(mockSaveApplicationsInCache).toHaveBeenCalledTimes(1);
        });
    });

    describe("saveApplicationsInCache", () => {
        it("should upsert entites asynchornously", async () => {
            const ENTITIES = [{ reference: "REF1" }, { reference: "REF2" }];
            mockUpsert.mockImplementation();
            // @ts-expect-error: private method
            await dauphinService.saveApplicationsInCache(ENTITIES);
            expect(mockUpsert).toHaveBeenNthCalledWith(1, { dauphin: ENTITIES[0] });
            expect(mockUpsert).toHaveBeenNthCalledWith(2, { dauphin: ENTITIES[1] });
        });
    });

    describe("formatAndReturnDto", () => {
        it("should remove fields", () => {
            const objectToKeep = { foo: "bar" };
            const demandeurFieldToKeep = { fieldToKeep: "baz" };
            const beneficiaireFieldToKeep = { fieldToKeep: "ban" };
            const expected = {
                objectToKeep,
                demandeur: demandeurFieldToKeep,
                beneficiaires: [beneficiaireFieldToKeep],
            };
            // @ts-expect-error: private method
            const actual = dauphinService.formatAndReturnDto({
                _source: {
                    objectToKeep,
                    demandeur: { ...demandeurFieldToKeep, pieces: "", history: "", linkedUsers: "" },
                    beneficiaires: [{ ...beneficiaireFieldToKeep, pieces: "", history: "", linkedUsers: "" }],
                },
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("toDauphinDateString", () => {
        it("should return date", () => {
            const DATE = new Date("2023-04-12");
            const expected = "2023-04-12";
            // @ts-expect-error: private method
            const actual = dauphinService.toDauphinDateString(DATE);
            expect(actual).toEqual(expected);
        });
    });

    describe("buildSearchHeader", () => {
        it("should build header", () => {
            // @ts-expect-error buildSearchHeader is private
            expect(dauphinService.buildSearchHeader(TOKEN)).toMatchSnapshot();
        });
    });

    describe("getAuthToken", () => {
        const getDauphinTokenMock: jest.SpyInstance<unknown> = jest.spyOn(configurationsService, "getDauphinToken");
        const getDauphinTokenAvailableTimeMock: jest.SpyInstance<unknown> = jest.spyOn(
            configurationsService,
            "getDauphinTokenAvailableTime",
        );
        const setDauphinTokenMock: jest.SpyInstance<unknown> = jest.spyOn(configurationsService, "setDauphinToken");
        // @ts-expect-error sendAuthRequest is private
        const sendAuthRequestMock: jest.SpyInstance<unknown> = jest.spyOn(dauphinService, "sendAuthRequest");

        it("should return cached token", async () => {
            getDauphinTokenMock.mockImplementationOnce(() => ({
                updatedAt: new Date(),
                data: TOKEN,
            }));
            getDauphinTokenAvailableTimeMock.mockImplementationOnce(() => ({
                data: Infinity,
            }));

            // @ts-expect-error getAuthToken is private
            const actual = await dauphinService.getAuthToken();

            expect(actual).toBe(TOKEN);
        });

        it("should return new token", async () => {
            getDauphinTokenMock.mockImplementationOnce(() => ({
                updatedAt: new Date(),
                data: "WRONG_TOKEN",
            }));
            getDauphinTokenAvailableTimeMock.mockImplementationOnce(() => ({
                data: -Infinity,
            }));
            sendAuthRequestMock.mockImplementationOnce(() => TOKEN);
            setDauphinTokenMock.mockImplementationOnce(() => null);
            // @ts-expect-error getAuthToken is private
            const actual = await dauphinService.getAuthToken();

            expect(actual).toBe(TOKEN);
        });

        it("should return new token because no old token", async () => {
            getDauphinTokenMock.mockImplementationOnce(() => null);
            getDauphinTokenAvailableTimeMock.mockImplementationOnce(() => ({
                data: -Infinity,
            }));
            sendAuthRequestMock.mockImplementationOnce(() => TOKEN);
            setDauphinTokenMock.mockImplementationOnce(() => null);
            // @ts-expect-error getAuthToken is private
            const actual = await dauphinService.getAuthToken();

            expect(actual).toBe(TOKEN);
        });

        it("should save the new token", async () => {
            getDauphinTokenMock.mockImplementationOnce(() => ({
                updatedAt: new Date(),
                data: "WRONG_TOKEN",
            }));
            getDauphinTokenAvailableTimeMock.mockImplementationOnce(() => ({
                data: -Infinity,
            }));
            sendAuthRequestMock.mockImplementationOnce(() => TOKEN);
            setDauphinTokenMock.mockImplementationOnce(() => null);

            // @ts-expect-error getAuthToken is private
            const actual = await dauphinService.getAuthToken();

            expect(setDauphinTokenMock).toHaveBeenCalledWith(TOKEN);
        });
    });

    describe("sendAuthRequest", () => {
        it("should call axios", async () => {
            // @ts-expect-error sendAuthRequest is private
            await dauphinService.sendAuthRequest();
            // @ts-expect-error: mock
            expect(axios.post.mock.calls[0]).toMatchSnapshot();
        });

        it("should return data", async () => {
            const expected = { hello: "world" };
            // @ts-expect-error: mock
            axios.post.mockImplementationOnce(async () => ({ data: expected }));

            // @ts-expect-error sendAuthRequest is private
            const actual = await dauphinService.sendAuthRequest();

            expect(actual).toEqual(expected);
        });
    });
});

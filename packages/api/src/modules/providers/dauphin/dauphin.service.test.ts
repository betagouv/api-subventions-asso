import axios from "axios";
import configurationsService from "../../configurations/configurations.service";
import DauphinDtoAdapter from "./adapters/DauphinDtoAdapter";
import dauphinService from "./dauphin.service";
import dauhpinCachesRepository from "./repositories/dauphinCache.repository";
import * as ApiConf from "./../../../configurations/apis.conf";

jest.mock("./../../../configurations/apis.conf", () => ({
    DAUPHIN_USERNAME: "DAUPHIN_USERNAME",
    DAUPHIN_PASSWORD: "DAUPHIN_PASSWORD"
}));

describe("Dauphin Service", () => {
    const TOKEN = "FAKE_TOKEN";
    describe("getDemandeSubventionBySiret", () => {
        const getLastUpdateMock: jest.SpyInstance<unknown> = jest.spyOn(
            dauhpinCachesRepository,
            "getLastUpdateBySiren"
        );
        const findBySirenMock: jest.SpyInstance<unknown> = jest.spyOn(dauhpinCachesRepository, "findBySiret");
        const upsertMock: jest.SpyInstance<unknown> = jest.spyOn(dauhpinCachesRepository, "upsert");
        // @ts-expect-error getAuthToken is private methode
        const getAuthTokenMock: jest.SpyInstance<unknown> = jest.spyOn(dauphinService, "getAuthToken");
        const getDauphinSubventionsMock: jest.SpyInstance<unknown> = jest.spyOn(
            dauphinService,
            // @ts-expect-error getDauphinSubventions is private methode
            "getDauphinSubventions"
        );

        const toDemandeSubventionMock: jest.SpyInstance<unknown> = jest.spyOn(DauphinDtoAdapter, "toDemandeSubvention");

        it("should return subventions", async () => {
            const expected = [{ fake: "data" }];

            getLastUpdateMock.mockImplementationOnce(async () => undefined);
            getAuthTokenMock.mockImplementationOnce(async () => TOKEN);
            getDauphinSubventionsMock.mockImplementationOnce(async () => []);
            upsertMock.mockImplementationOnce(async () => null);
            findBySirenMock.mockImplementationOnce(async () => expected);
            toDemandeSubventionMock.mockImplementationOnce(data => data);

            const actual = await dauphinService.getDemandeSubventionBySiret("FAKE_SIRET");

            expect(actual).toEqual(expected);
        });

        it("should set subventions in cache", async () => {
            const expected = { fake: "data" };

            getLastUpdateMock.mockImplementationOnce(async () => undefined);
            getAuthTokenMock.mockImplementationOnce(async () => TOKEN);
            getDauphinSubventionsMock.mockImplementationOnce(async () => [expected]);
            upsertMock.mockImplementationOnce(async () => null);
            findBySirenMock.mockImplementationOnce(async () => [expected]);
            toDemandeSubventionMock.mockImplementationOnce(data => data);

            await dauphinService.getDemandeSubventionBySiret("FAKE_SIRET");

            expect(upsertMock).toHaveBeenCalledWith(expected);
        });

        it("should keep lastUpdate", async () => {
            const expected = new Date();

            getLastUpdateMock.mockImplementationOnce(async () => expected);
            getAuthTokenMock.mockImplementationOnce(async () => TOKEN);
            getDauphinSubventionsMock.mockImplementationOnce(async () => []);
            upsertMock.mockImplementationOnce(async () => null);
            findBySirenMock.mockImplementationOnce(async () => []);
            toDemandeSubventionMock.mockImplementationOnce(data => data);

            await dauphinService.getDemandeSubventionBySiret("12345678912345");

            expect(getDauphinSubventionsMock).toHaveBeenCalledWith("123456789", TOKEN, expected);
        });

        it("should keep token", async () => {
            const expected = TOKEN;

            getLastUpdateMock.mockImplementationOnce(async () => undefined);
            getAuthTokenMock.mockImplementationOnce(async () => TOKEN);
            getDauphinSubventionsMock.mockImplementationOnce(async () => []);
            upsertMock.mockImplementationOnce(async () => null);
            findBySirenMock.mockImplementationOnce(async () => []);
            toDemandeSubventionMock.mockImplementationOnce(data => data);

            await dauphinService.getDemandeSubventionBySiret("12345678912345");

            expect(getDauphinSubventionsMock).toHaveBeenCalledWith("123456789", expected, undefined);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        const getLastUpdateMock: jest.SpyInstance<unknown> = jest.spyOn(
            dauhpinCachesRepository,
            "getLastUpdateBySiren"
        );
        const findBySirenMock: jest.SpyInstance<unknown> = jest.spyOn(dauhpinCachesRepository, "findBySiren");
        const upsertMock: jest.SpyInstance<unknown> = jest.spyOn(dauhpinCachesRepository, "upsert");
        // @ts-expect-error getAuthToken is private methode
        const getAuthTokenMock: jest.SpyInstance<unknown> = jest.spyOn(dauphinService, "getAuthToken");
        const getDauphinSubventionsMock: jest.SpyInstance<unknown> = jest.spyOn(
            dauphinService,
            // @ts-expect-error getDauphinSubventions is private methode
            "getDauphinSubventions"
        );

        const toDemandeSubventionMock: jest.SpyInstance<unknown> = jest.spyOn(DauphinDtoAdapter, "toDemandeSubvention");

        it("should return subventions", async () => {
            const expected = [{ fake: "data" }];

            getLastUpdateMock.mockImplementationOnce(async () => undefined);
            getAuthTokenMock.mockImplementationOnce(async () => TOKEN);
            getDauphinSubventionsMock.mockImplementationOnce(async () => []);
            upsertMock.mockImplementationOnce(async () => null);
            findBySirenMock.mockImplementationOnce(async () => expected);
            toDemandeSubventionMock.mockImplementationOnce(data => data);

            const actual = await dauphinService.getDemandeSubventionBySiren("FAKE_SIREN");

            expect(actual).toEqual(expected);
        });

        it("should set subventions in cache", async () => {
            const expected = { fake: "data" };

            getLastUpdateMock.mockImplementationOnce(async () => undefined);
            getAuthTokenMock.mockImplementationOnce(async () => TOKEN);
            getDauphinSubventionsMock.mockImplementationOnce(async () => [expected]);
            upsertMock.mockImplementationOnce(async () => null);
            findBySirenMock.mockImplementationOnce(async () => [expected]);
            toDemandeSubventionMock.mockImplementationOnce(data => data);

            await dauphinService.getDemandeSubventionBySiren("FAKE_SIRET");

            expect(upsertMock).toHaveBeenCalledWith(expected);
        });

        it("should keep lastUpdate", async () => {
            const expected = new Date();

            getLastUpdateMock.mockImplementationOnce(async () => expected);
            getAuthTokenMock.mockImplementationOnce(async () => TOKEN);
            getDauphinSubventionsMock.mockImplementationOnce(async () => []);
            upsertMock.mockImplementationOnce(async () => null);
            findBySirenMock.mockImplementationOnce(async () => []);
            toDemandeSubventionMock.mockImplementationOnce(data => data);

            await dauphinService.getDemandeSubventionBySiren("123456789");

            expect(getDauphinSubventionsMock).toHaveBeenCalledWith("123456789", TOKEN, expected);
        });

        it("should keep token", async () => {
            const expected = TOKEN;

            getLastUpdateMock.mockImplementationOnce(async () => undefined);
            getAuthTokenMock.mockImplementationOnce(async () => TOKEN);
            getDauphinSubventionsMock.mockImplementationOnce(async () => []);
            upsertMock.mockImplementationOnce(async () => null);
            findBySirenMock.mockImplementationOnce(async () => []);
            toDemandeSubventionMock.mockImplementationOnce(data => data);

            await dauphinService.getDemandeSubventionBySiren("123456789");

            expect(getDauphinSubventionsMock).toHaveBeenCalledWith("123456789", expected, undefined);
        });
    });

    describe("getDemandeSubventionByRna", () => {
        it("should return null", async () => {
            const expected = null;
            const actual = await dauphinService.getDemandeSubventionByRna("FAKE_RNA");

            expect(expected).toBe(actual);
        });
    });

    describe("getDauphinSubventions", () => {
        const axiosPostMock: jest.SpyInstance<unknown> = jest.spyOn(axios, "post");
        // @ts-expect-error buildSearchQuery is private
        const buildSearchQueryMock: jest.SpyInstance<unknown> = jest.spyOn(dauphinService, "buildSearchQuery");
        // @ts-expect-error buildSearchQuery is private
        const buildSearchHeaderMock: jest.SpyInstance<unknown> = jest.spyOn(dauphinService, "buildSearchHeader");

        it("should return data", async () => {
            const expected = [{ a: true }, { b: true }];

            axiosPostMock.mockImplementationOnce(async () => ({
                data: {
                    hits: {
                        hits: expected.map(data => ({ _source: data }))
                    }
                }
            }));

            // @ts-expect-error getDauphinSubventions is private
            const actual = await dauphinService.getDauphinSubventions("FAKE_SIREN", TOKEN);

            expect(actual).toEqual(expected);
        });

        it("should keep token", async () => {
            const expected = TOKEN;

            axiosPostMock.mockImplementationOnce(async () => ({
                data: {
                    hits: {
                        hits: []
                    }
                }
            }));

            // @ts-expect-error getDauphinSubventions is private
            await dauphinService.getDauphinSubventions("FAKE_SIREN", TOKEN);

            expect(buildSearchHeaderMock).toHaveBeenCalledWith(expected);
        });

        it("should keep siren and lastupdate", async () => {
            const expected = ["FAKE_SIREN", new Date()];

            axiosPostMock.mockImplementationOnce(async () => ({
                data: {
                    hits: {
                        hits: []
                    }
                }
            }));

            // @ts-expect-error getDauphinSubventions is private
            await dauphinService.getDauphinSubventions(expected[0], TOKEN, expected[1]);

            expect(buildSearchQueryMock).toHaveBeenCalledWith(...expected);
        });
    });

    describe("buildSearchQuery", () => {
        it("should send siren", () => {
            // @ts-expect-error buildSearchQuery is private
            expect(dauphinService.buildSearchQuery("FAKE_SIREN")).toMatchSnapshot();
        });

        it("should send siren and date", () => {
            const dateString = new Date("1970-01-01").toLocaleString("en-US", { timeZone: "Europe/Paris" });

            // @ts-expect-error buildSearchQuery is private
            expect(dauphinService.buildSearchQuery("FAKE_SIREN", new Date(dateString))).toMatchSnapshot();
        });
    });

    describe("buildFindByIdQuery", () => {
        it("should send ref", () => {
            // @ts-expect-error buildFindByIdQuery is private
            expect(dauphinService.buildFindByIdQuery("REF")).toMatchSnapshot();
        });
    });

    describe("buildQuery", () => {
        it("should build query", () => {
            // @ts-expect-error buildQuery is private
            expect(dauphinService.buildQuery({ obj: true })).toMatchSnapshot();
        });
    });

    describe("buildSearchHeader", () => {
        it("should build header", () => {
            // @ts-expect-error buildSearchHeader is private
            expect(dauphinService.buildSearchHeader(TOKEN)).toMatchSnapshot();
        });
    });

    describe("formatDateToDauphinDate", () => {
        it("should format date", () => {
            const dateString = new Date("1970-01-01").toLocaleString("en-US", { timeZone: "Europe/Paris" });
            // @ts-expect-error formatDateToDauphinDate is private
            expect(dauphinService.formatDateToDauphinDate(new Date(dateString))).toEqual(
                "1970\\-01\\-01T01\\:00\\:00.000Z"
            );
        });
    });

    describe("getAuthToken", () => {
        const getDauphinTokenMock: jest.SpyInstance<unknown> = jest.spyOn(configurationsService, "getDauphinToken");
        const getDauphinTokenAvailableTimeMock: jest.SpyInstance<unknown> = jest.spyOn(
            configurationsService,
            "getDauphinTokenAvailableTime"
        );
        const setDauphinTokenMock: jest.SpyInstance<unknown> = jest.spyOn(configurationsService, "setDauphinToken");
        // @ts-expect-error sendAuthRequest is private
        const sendAuthRequestMock: jest.SpyInstance<unknown> = jest.spyOn(dauphinService, "sendAuthRequest");

        it("should return cached token", async () => {
            getDauphinTokenMock.mockImplementationOnce(() => ({ updatedAt: new Date(), data: TOKEN }));
            getDauphinTokenAvailableTimeMock.mockImplementationOnce(() => ({ data: Infinity }));

            // @ts-expect-error getAuthToken is private
            const actual = await dauphinService.getAuthToken();

            expect(actual).toBe(TOKEN);
        });

        it("should return new token", async () => {
            getDauphinTokenMock.mockImplementationOnce(() => ({ updatedAt: new Date(), data: "WRONG_TOKEN" }));
            getDauphinTokenAvailableTimeMock.mockImplementationOnce(() => ({ data: -Infinity }));
            sendAuthRequestMock.mockImplementationOnce(() => TOKEN);
            setDauphinTokenMock.mockImplementationOnce(() => null);
            // @ts-expect-error getAuthToken is private
            const actual = await dauphinService.getAuthToken();

            expect(actual).toBe(TOKEN);
        });

        it("should return new token because no old token", async () => {
            getDauphinTokenMock.mockImplementationOnce(() => null);
            getDauphinTokenAvailableTimeMock.mockImplementationOnce(() => ({ data: -Infinity }));
            sendAuthRequestMock.mockImplementationOnce(() => TOKEN);
            setDauphinTokenMock.mockImplementationOnce(() => null);
            // @ts-expect-error getAuthToken is private
            const actual = await dauphinService.getAuthToken();

            expect(actual).toBe(TOKEN);
        });

        it("should save the new token", async () => {
            getDauphinTokenMock.mockImplementationOnce(() => ({ updatedAt: new Date(), data: "WRONG_TOKEN" }));
            getDauphinTokenAvailableTimeMock.mockImplementationOnce(() => ({ data: -Infinity }));
            sendAuthRequestMock.mockImplementationOnce(() => TOKEN);
            setDauphinTokenMock.mockImplementationOnce(() => null);

            // @ts-expect-error getAuthToken is private
            const actual = await dauphinService.getAuthToken();

            expect(setDauphinTokenMock).toHaveBeenCalledWith(TOKEN);
        });
    });

    describe("sendAuthRequest", () => {
        const axiosPostMock: jest.SpyInstance<unknown> = jest.spyOn(axios, "post");

        it("should call axios.post with good data", async () => {
            axiosPostMock.mockImplementationOnce(async () => ({ data: null }));

            // @ts-expect-error sendAuthRequest is private
            await dauphinService.sendAuthRequest();

            expect(axiosPostMock.mock.calls).toMatchSnapshot();
        });

        it("should return data", async () => {
            const expected = { hello: "world" };
            axiosPostMock.mockImplementationOnce(async () => ({ data: expected }));

            // @ts-expect-error sendAuthRequest is private
            const actual = await dauphinService.sendAuthRequest();

            expect(actual).toEqual(expected);
        });
    });
});

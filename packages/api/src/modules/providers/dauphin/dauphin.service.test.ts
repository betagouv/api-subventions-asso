import configurationsService from "../../configurations/configurations.service";
import DauphinDtoAdapter from "./adapters/DauphinDtoAdapter";
import dauphinService from "./dauphin.service";
import dauphinGisproRepository from "./repositories/dauphin-gispro.repository";
import SpyInstance = jest.SpyInstance;
import { Siret, Siren } from "dto";
import * as sirenHelper from "../../../shared/helpers/SirenHelper";
import { RequestResponse } from "../../provider-request/@types/RequestResponse";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import RnaSirenEntity from "../../../entities/RnaSirenEntity";

jest.mock("axios", () => ({
    post: jest.fn(),
    get: jest.fn(),
}));

jest.mock("./repositories/dauphin-gispro.repository", () => ({
    getLastImportDate: jest.fn(() => new Date()),
    upsert: jest.fn(),
    findBySiret: jest.fn(),
    findBySiren: jest.fn(),
}));

jest.mock("./adapters/DauphinDtoAdapter");

const SIRET: Siret = "12345678912345";
const SIREN: Siren = "123456789";

jest.mock("./../../../configurations/apis.conf", () => ({
    DAUPHIN_USERNAME: "DAUPHIN_USERNAME",
    DAUPHIN_PASSWORD: "DAUPHIN_PASSWORD",
}));

describe("Dauphin Service", () => {
    const TOKEN = "FAKE_TOKEN";
    let httpPostSpy: jest.SpyInstance;
    let httpGetSpy: jest.SpyInstance;

    const DATA = [{ a: true }, { b: true }];

    beforeAll(() => {
        // @ts-expect-error http is protected methode
        httpPostSpy = jest.spyOn(dauphinService.http, "post");
        // @ts-expect-error http is protected methode
        httpGetSpy = jest.spyOn(dauphinService.http, "get");
        httpPostSpy.mockResolvedValue({
            data: {
                hits: {
                    total: DATA.length,
                    hits: DATA,
                },
            },
        } as RequestResponse<unknown>);
    });

    /**
     * |-------------------------|
     * |   Demande Part          |
     * |-------------------------|
     */

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication = { data: { foo: "bar" } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };

        it("should call DauphinDtoAdapter.rawToApplication", () => {
            dauphinService.rawToApplication(RAW_APPLICATION);
            expect(DauphinDtoAdapter.rawToApplication).toHaveBeenCalledWith(RAW_APPLICATION);
        });

        it("should return DemandeSubvention", () => {
            jest.mocked(DauphinDtoAdapter.rawToApplication).mockReturnValueOnce(APPLICATION);
            const expected = APPLICATION;
            const actual = dauphinService.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiret", () => {
        // @ts-expect-error mock
        afterEach(() => DauphinDtoAdapter.toDemandeSubvention.mockReset());

        it("should return subventions", async () => {
            const APPLICATION_ENTITIES = [{ id: "A" }, { id: "B" }];
            const expected = APPLICATION_ENTITIES;
            // @ts-expect-error: mock return value
            dauphinGisproRepository.findBySiret.mockImplementationOnce(async () => APPLICATION_ENTITIES);
            // @ts-expect-error: mock return value
            DauphinDtoAdapter.toDemandeSubvention.mockImplementation(data => data);

            const actual = await dauphinService.getDemandeSubventionBySiret(SIRET);

            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        it("should return subventions", async () => {
            const expected = [{ fake: "data" }];
            // @ts-expect-error: mock return value
            dauphinGisproRepository.findBySiren.mockImplementationOnce(async () => expected);
            // @ts-expect-error: mock return value
            DauphinDtoAdapter.toDemandeSubvention.mockImplementationOnce(data => data);
            const actual = await dauphinService.getDemandeSubventionBySiren("FAKE_SIREN");
            expect(actual).toEqual(expected);
        });
    });

    /**
     * |-------------------------|
     * |   Raw Grant Part        |
     * |-------------------------|
     */

    describe("raw grant", () => {
        const DATA = [{ gispro: { ej: "EJ" } }];

        describe("getRawGrantsBySiret", () => {
            const SIRET = "12345678900000";
            let findBySiretMock;
            beforeAll(
                () =>
                    (findBySiretMock = jest
                        .spyOn(dauphinGisproRepository, "findBySiret")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySiretMock.mockRestore());

            it("should call findBySiret()", async () => {
                await dauphinService.getRawGrantsBySiret(SIRET);
                expect(findBySiretMock).toHaveBeenCalledWith(SIRET);
            });

            it("returns raw grant data", async () => {
                const actual = await dauphinService.getRawGrantsBySiret(SIRET);
                expect(actual).toMatchInlineSnapshot(`
                                    Array [
                                      Object {
                                        "data": Object {
                                          "gispro": Object {
                                            "ej": "EJ",
                                          },
                                        },
                                        "joinKey": "EJ",
                                        "provider": "dauphin",
                                        "type": "application",
                                      },
                                    ]
                            `);
            });
        });

        describe("getRawGrantsBySiren", () => {
            const SIREN = "123456789";
            let findBySirenMock;
            beforeAll(
                () =>
                    (findBySirenMock = jest
                        .spyOn(dauphinGisproRepository, "findBySiren")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySirenMock.mockRestore());

            it("should call findBySiren()", async () => {
                await dauphinService.getRawGrantsBySiren(SIREN);
                expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("returns raw grant data", async () => {
                const actual = await dauphinService.getRawGrantsBySiren(SIREN);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "gispro": Object {
                            "ej": "EJ",
                          },
                        },
                        "joinKey": "EJ",
                        "provider": "dauphin",
                        "type": "application",
                      },
                    ]
                `);
            });
        });
    });

    describe("rawToCommon", () => {
        const RAW = "RAW";
        const ADAPTED = {};

        beforeAll(() => {
            DauphinDtoAdapter.toCommon
                // @ts-expect-error: mock
                .mockImplementation(input => input.toString());
        });

        afterAll(() => {
            // @ts-expect-error: mock
            DauphinDtoAdapter.toCommon.mockReset();
        });

        it("calls adapter with data from raw grant", () => {
            // @ts-expect-error: mock
            dauphinService.rawToCommon({ data: RAW });
            expect(DauphinDtoAdapter.toCommon).toHaveBeenCalledWith(RAW);
        });
        it("returns result from adapter", () => {
            // @ts-expect-error: mock
            DauphinDtoAdapter.toCommon.mockReturnValueOnce(ADAPTED);
            const expected = ADAPTED;
            // @ts-expect-error: mock
            const actual = dauphinService.rawToCommon({ data: RAW });
            expect(actual).toEqual(expected);
        });
    });

    /**
     * |-------------------------|
     * |   Caching Part          |
     * |-------------------------|
     */

    describe("updateApplicationCache", () => {
        // @ts-expect-error spy private method
        const mockBuildSearchHeader = jest.spyOn(dauphinService, "buildSearchHeader");
        // @ts-expect-error spy private method
        const mockBuildFetchFromDateQuery = jest.spyOn(dauphinService, "buildFetchApplicationFromDateQuery");
        // @ts-expect-error spy private method
        const mockFormatAndReturnDto = jest.spyOn(dauphinService, "formatAndReturnApplicationDto");
        // @ts-expect-error: spy private method
        const mockSaveApplicationsInCache = jest.spyOn(dauphinService, "saveApplicationsInCache");
        // @ts-expect-error: spy private method
        const mockGetAuthToken = jest.spyOn(dauphinService, "getAuthToken");
        const mocks = [
            mockBuildSearchHeader,
            mockBuildFetchFromDateQuery,
            mockFormatAndReturnDto,
            mockSaveApplicationsInCache,
            mockGetAuthToken,
        ];

        beforeEach(() => {
            // @ts-expect-error: mock
            mockGetAuthToken.mockImplementation(async () => TOKEN);
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

        it("should call repository.getLastImportDate()", async () => {
            await dauphinService.updateApplicationCache();
            expect(dauphinGisproRepository.getLastImportDate).toHaveBeenCalledTimes(1);
        });

        it("should call getAuthToken", async () => {
            await dauphinService.updateApplicationCache();
            expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
        });

        it("should call buildFetchFromDateQuery", async () => {
            jest.useFakeTimers();
            const DATE = new Date();
            await dauphinService.updateApplicationCache();
            expect(mockBuildFetchFromDateQuery).toHaveBeenCalledWith(DATE);
            jest.useRealTimers();
        });

        it("should build headers from token", async () => {
            const expected = TOKEN;
            await dauphinService.updateApplicationCache();
            expect(mockBuildSearchHeader).toHaveBeenCalledWith(expected);
        });

        it("should call httpSpy with args", async () => {
            await dauphinService.updateApplicationCache();
            expect(httpPostSpy.mock.calls[0]).toMatchSnapshot();
        });

        it("should call mockSaveApplicationsInCache", async () => {
            await dauphinService.updateApplicationCache();
            expect(mockSaveApplicationsInCache).toHaveBeenCalledTimes(1);
        });
    });

    describe("saveApplicationsInCache", () => {
        it("should upsert entities asynchronously", async () => {
            const ENTITIES = [{ reference: "REF1" }, { reference: "REF2" }];
            // @ts-expect-error: private method
            await dauphinService.saveApplicationsInCache(ENTITIES);
            expect(dauphinGisproRepository.upsert).toHaveBeenNthCalledWith(1, { dauphin: ENTITIES[0] });
            expect(dauphinGisproRepository.upsert).toHaveBeenNthCalledWith(2, { dauphin: ENTITIES[1] });
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
            const actual = dauphinService.formatAndReturnApplicationDto({
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
            await dauphinService.getAuthToken();

            expect(setDauphinTokenMock).toHaveBeenCalledWith(TOKEN);
        });
    });

    describe("sendAuthRequest", () => {
        it("should call httpSpy", async () => {
            // @ts-expect-error sendAuthRequest is private
            await dauphinService.sendAuthRequest();
            expect(httpPostSpy.mock.calls[0]).toMatchSnapshot();
        });

        it("should return data", async () => {
            const expected = { hello: "world" };
            httpPostSpy.mockImplementationOnce(async () => ({ data: expected }));

            // @ts-expect-error sendAuthRequest is private
            const actual = await dauphinService.sendAuthRequest();

            expect(actual).toEqual(expected);
        });
    });

    describe("documents", () => {
        const DOC = "";
        let mockGetAuthToken: SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: mock
            mockGetAuthToken = jest.spyOn(dauphinService, "getAuthToken").mockImplementation(async () => TOKEN);
        });
        afterAll(() => mockGetAuthToken.mockRestore());

        describe("getSpecificDocumentStream", () => {
            const DOC_URL = "URL";
            const httpSpy_RES = "RES";

            beforeAll(() => {
                httpGetSpy.mockResolvedValue({ data: httpSpy_RES });
            });

            it("should call getAuthToken", async () => {
                await dauphinService.getSpecificDocumentStream(DOC_URL);
                expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
            });

            it("should call httpSpy with args", async () => {
                await dauphinService.getSpecificDocumentStream(DOC_URL);
                expect(httpGetSpy.mock.calls[0]).toMatchSnapshot();
            });

            it("should return stream from httpSpy", async () => {
                const expected = httpSpy_RES;
                const actual = await dauphinService.getSpecificDocumentStream(DOC_URL);
                expect(actual).toEqual(expected);
            });
        });

        describe("getDocumentsByRna", () => {
            const RNA = "RNA";
            let getSirenMock: SpyInstance, getBySirenMock: SpyInstance;

            beforeAll(() => {
                getSirenMock = jest.spyOn(rnaSirenService, "find").mockResolvedValue([new RnaSirenEntity(RNA, SIREN)]);
                // @ts-expect-error: mock
                getBySirenMock = jest.spyOn(dauphinService, "getDocumentsBySiren").mockResolvedValue(DOC);
            });
            afterAll(() => {
                getSirenMock.mockRestore();
                getBySirenMock.mockRestore();
            });

            it("gets siren", async () => {
                await dauphinService.getDocumentsByRna(RNA);
                expect(getSirenMock).toHaveBeenCalled();
            });

            it("does not get documents if no siren", async () => {
                getSirenMock.mockResolvedValueOnce(null);
                await dauphinService.getDocumentsByRna(RNA);
                expect(getBySirenMock).not.toHaveBeenCalled();
            });

            it("gets documents with siren", async () => {
                await dauphinService.getDocumentsByRna(RNA);
                expect(getBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("returns document from siren method", async () => {
                const expected = DOC;
                const actual = await dauphinService.getDocumentsByRna(RNA);
                expect(actual).toBe(expected);
            });
        });

        describe("getDocumentsBySiren", () => {
            let findIdMock: SpyInstance;
            const RAW_DOCS = ["httpSpy"];
            const ADAPTED_DOCS = ["doc"];
            const httpSpy_RES = { pieces: RAW_DOCS };
            const ID = "DAUPHIN_ID";

            beforeAll(() => {
                // @ts-expect-error: mock
                findIdMock = jest.spyOn(dauphinService, "findDauphinInternalId").mockResolvedValue(ID);
                httpGetSpy.mockResolvedValue({ data: httpSpy_RES });
                // @ts-expect-error: mock
                DauphinDtoAdapter.toDocuments.mockReturnValue(ADAPTED_DOCS);
            });

            afterAll(() => {
                httpGetSpy.mockRestore();
                findIdMock.mockRestore();
            });

            it("gets internal id", async () => {
                await dauphinService.getDocumentsBySiren(SIREN);
                expect(findIdMock).toHaveBeenCalled();
            });

            it("does not call httpSpy if no internal id", async () => {
                findIdMock.mockResolvedValueOnce(null);
                await dauphinService.getDocumentsBySiren(SIREN);
                expect(httpGetSpy).not.toHaveBeenCalled();
            });

            it("should call getAuthToken", async () => {
                await dauphinService.getDocumentsBySiren(SIREN);
                expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
            });

            it("should call httpSpy with args", async () => {
                await dauphinService.getDocumentsBySiren(SIREN);
                expect(httpGetSpy.mock.calls[0]).toMatchSnapshot();
            });

            it("should adapt result from httpSpy", async () => {
                await dauphinService.getDocumentsBySiren(SIREN);
                expect(DauphinDtoAdapter.toDocuments).toHaveBeenCalledWith(RAW_DOCS);
            });

            it("returns documents from httpSpy", async () => {
                const expected = ADAPTED_DOCS;
                const actual = await dauphinService.getDocumentsBySiren(SIREN);
                expect(actual).toEqual(expected);
            });
        });

        describe("getDocumentsBySiret", () => {
            let getSirenMock: SpyInstance, getBySirenMock: SpyInstance;

            beforeAll(() => {
                getSirenMock = jest.spyOn(sirenHelper, "siretToSiren").mockReturnValue(SIREN);
                // @ts-expect-error: mock
                getBySirenMock = jest.spyOn(dauphinService, "getDocumentsBySiren").mockResolvedValue(DOC);
            });
            afterAll(() => {
                getSirenMock.mockRestore();
                getBySirenMock.mockRestore();
            });

            it("gets siren", async () => {
                await dauphinService.getDocumentsBySiret(SIRET);
                expect(getSirenMock).toHaveBeenCalled();
            });

            it("gets documents with siren", async () => {
                await dauphinService.getDocumentsBySiret(SIRET);
                expect(getBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("returns document from siren method", async () => {
                const expected = DOC;
                const actual = await dauphinService.getDocumentsBySiret(SIRET);
                expect(actual).toBe(expected);
            });
        });

        describe("findDauphinInternalId", () => {
            const ID = "DAUPHIN_ID";
            const httpSpy_RES = {
                hits: {
                    hits: [{ _source: { SIREN: "pas le bon" } }, { _source: { SIREN: SIREN }, _id: `cget-${ID}` }],
                },
            };

            beforeAll(() => {
                httpPostSpy.mockResolvedValue({ data: httpSpy_RES });
            });

            it("should call getAuthToken", async () => {
                // @ts-expect-errors test private method
                await dauphinService.findDauphinInternalId(SIREN);
                expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
            });

            it("should call httpSpy with args", async () => {
                // @ts-expect-errors test private method
                await dauphinService.findDauphinInternalId(SIREN);
                expect(httpPostSpy.mock.calls[0]).toMatchSnapshot();
            });

            it("returns id from httpSpy with proper siren", async () => {
                const expected = ID;
                // @ts-expect-errors test private method
                const actual = await dauphinService.findDauphinInternalId(SIREN);
                expect(actual).toBe(expected);
            });
        });
    });
});

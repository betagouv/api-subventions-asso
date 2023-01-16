import axios, { AxiosError } from "axios";
import qs from "qs";
import StructureIdentifiersError from "../../../shared/errors/StructureIdentifierError";
import apiEntrepriseService from "./apiEntreprise.service";

describe("ApiEntrepriseService", () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));
    const SIREN = "120034005";
    const SIRET = SIREN + "00001";
    const HEADCOUNT_REASON = "Remonter l'effectif pour le service Data.Subvention";
    const RCS_EXTRACT_REASON = "Remonter l'extrait RCS d'une associaiton pour Data.Subvention";

    // @ts-expect-error
    const sendRequestMock = jest.spyOn(apiEntrepriseService, "sendRequest");

    jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

    beforeEach(() => {
        // @ts-expect-error requestCache is private
        apiEntrepriseService.requestCache.collection.clear();
    });

    describe("sendRequest()()", () => {
        const axiosGetMock = jest.spyOn(axios, "get");
        const qsMock = jest.spyOn(qs, "stringify");

        it("should return data", async () => {
            const expected = { test: true };
            axiosGetMock.mockImplementationOnce(async () => ({
                status: 200,
                data: expected
            }));

            // @ts-expect-error sendRequest is private method
            const actual = await apiEntrepriseService.sendRequest("test", {}, "");

            expect(expected).toBe(actual);
        });

        it("should throw error", async () => {
            const expected = { response: { status: 404 } };
            axiosGetMock.mockImplementationOnce(async () => {
                throw expected;
            });
            let actual;
            try {
                // @ts-expect-error sendRequest is private methode
                await apiEntrepriseService.sendRequest("test", {}, "");
            } catch (e) {
                actual = e;
            }
            expect(expected).toBe(actual);
        });

        it("should call queryString with default params", async () => {
            const params = {
                context: "aides publiques",
                recipient: "12004101700035"
            };

            const expected = [{ ...params, object: HEADCOUNT_REASON }];

            axiosGetMock.mockImplementationOnce(async () => ({
                status: 200,
                data: { test: true }
            }));

            qsMock.mockImplementationOnce(() => "QUERY");

            // @ts-expect-error sendRequest is private methode
            apiEntrepriseService.sendRequest("test", {}, HEADCOUNT_REASON);
            const actual = qsMock.mock.calls[0];
            expect(actual).toEqual(expected);
        });
    });

    describe("getHeadcount()", () => {
        // I don't know why I have to specify <any> here... TS forces me to return a string in mock implementation.
        // Remove it and check error line 113
        // @ts-expect-error
        let getEtablissementHeadcountMock = jest.spyOn<any>(apiEntrepriseService, "getEtablissementHeadcount");

        afterAll(() => getEtablissementHeadcountMock.mockRestore());

        it("should look for etablissement headcount given a SIRET", async () => {
            getEtablissementHeadcountMock.mockImplementationOnce(jest.fn());
            await apiEntrepriseService.getHeadcount(SIRET);
            const actual = getEtablissementHeadcountMock.mock.calls.length;
            expect(actual).toEqual(1);
        });

        it("should not retry if error status not 404", async () => {
            const expected = { response: { status: 500 } };
            let actual;
            getEtablissementHeadcountMock.mockImplementation(() => {
                throw expected;
            });
            try {
                await apiEntrepriseService.getHeadcount(SIRET);
            } catch (e) {
                actual = e;
            }
            expect(getEtablissementHeadcountMock).toHaveBeenCalledTimes(1);
            expect(actual).toEqual(expected);
            getEtablissementHeadcountMock.mockReset();
        });

        it("should retry 5 times and throw error", async () => {
            const expected = { response: { status: 404 } };
            let actual;
            getEtablissementHeadcountMock.mockImplementation(() => {
                throw expected;
            });
            try {
                await apiEntrepriseService.getHeadcount(SIRET);
            } catch (e) {
                actual = e;
            }
            expect(getEtablissementHeadcountMock).toHaveBeenCalledTimes(5);
            expect(actual).toEqual(expected);
            getEtablissementHeadcountMock.mockReset();
        });

        it("should retry 5 times and return headcount", async () => {
            const error = { response: { status: 404 } };
            const expected = {};
            let actual;
            getEtablissementHeadcountMock
                .mockImplementationOnce(() => {
                    throw error;
                })
                .mockImplementationOnce(() => {
                    throw error;
                })
                .mockImplementationOnce(() => {
                    throw error;
                })
                .mockImplementationOnce(() => {
                    throw error;
                })
                // @ts-exect-error
                .mockImplementationOnce(() => expected);
            try {
                actual = await apiEntrepriseService.getHeadcount(SIRET);
            } catch (e) {}
            expect(actual).toEqual(expected);
        });

        it("should throw StructureIdentifiersError", async () => {
            const expected = new StructureIdentifiersError();
            getEtablissementHeadcountMock.mockImplementationOnce(jest.fn());
            let actual;
            try {
                await apiEntrepriseService.getHeadcount("NOT_A_SIRET");
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("getExtraitRcs()", () => {
        it.only("should return extrait rcs", async () => {
            const expected = {};
            // @ts-expect-error: mock
            sendRequestMock.mockImplementationOnce(async () => ({ data: expected }));
            const actual = await apiEntrepriseService.getExtractRcs(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should return null", async () => {
            const expected = null;
            sendRequestMock.mockImplementationOnce(() => {
                throw new Error();
            });
            const actual = await apiEntrepriseService.getExtractRcs(SIREN);
            expect(actual).toEqual(expected);
        });
        it("should throw StructureIdentifiersError", async () => {
            const expected = StructureIdentifiersError.name;
            let actual;
            try {
                actual = await apiEntrepriseService.getExtractRcs(SIRET);
            } catch (e) {
                actual = (e as Error).constructor.name;
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("getEtablissementHeadcount()", () => {
        it("should call sendRequest() with arguments", async () => {
            sendRequestMock.mockImplementationOnce(jest.fn());
            const expected = [
                // @ts-expect-error
                `${apiEntrepriseService.buildHeadcountUrl()}/etablissement/${SIRET}`,
                {},
                HEADCOUNT_REASON
            ];
            // @ts-expect-error
            await apiEntrepriseService.getEtablissementHeadcount(SIRET);
            const actual = sendRequestMock.mock.calls[0];
            expect(actual).toEqual(expected);
        });
    });

    describe("buildHeadcountUrl()", () => {
        it("should return a valid URL", () => {
            const expected = "effectifs_mensuels_acoss_covid/2022/01";
            // @ts-expect-error
            const actual = apiEntrepriseService.buildHeadcountUrl();
            expect(actual).toEqual(expected);
        });

        it("should minus the date month", () => {
            const expected = "effectifs_mensuels_acoss_covid/2021/12";
            // @ts-expect-error
            const actual = apiEntrepriseService.buildHeadcountUrl(1);
            expect(actual).toEqual(expected);
        });
    });

    describe("getExtraitRcs", () => {
        it("should return StructureIdentifierError", async () => {
            const execpted = new StructureIdentifiersError("siren");
            let actual;
            try {
                await apiEntrepriseService.getExtractRcs("NOT_A_SIREN");
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(execpted);
        });

        it("should return rcs extract", async () => {
            const expected = {};
            // @ts-expect-error
            sendRequestMock.mockImplementationOnce(async () => expected);
            const actual = await apiEntrepriseService.getExtractRcs(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should call sendRequest() with valid URL", async () => {
            const expected = [`v3/infogreffe/rcs/unites_legales/${SIREN}/extrait_kbis`, {}, RCS_EXTRACT_REASON];
            // @ts-expect-error
            sendRequestMock.mockImplementationOnce(async () => expected);
            await apiEntrepriseService.getExtractRcs(SIREN);
            const actual = sendRequestMock.mock.calls[0];
            expect(actual).toEqual(expected);
        });

        it("should return null if axios", async () => {
            const expected = null;
            sendRequestMock.mockImplementationOnce(() => {
                throw new Error();
            });
            const actual = await apiEntrepriseService.getExtractRcs(SIREN);
            expect(actual).toEqual(expected);
        });
    });
});

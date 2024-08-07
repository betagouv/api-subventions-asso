import qs from "qs";
import StructureIdentifiersError from "../../../shared/errors/StructureIdentifierError";
import apiEntrepriseService from "./apiEntreprise.service";
import Siren from "../../../valueObjects/Siren";
import EstablishmentIdentifier from "../../../valueObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";

describe("ApiEntrepriseService", () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));
    const SIREN = new Siren("120034005");
    const SIRET = SIREN.toSiret("00001");
    const HEADCOUNT_REASON = "Remonter l'effectif pour le service Data.Subvention";
    const RCS_EXTRACT_REASON = "Remonter l'extrait RCS d'une associaiton pour Data.Subvention";

    // @ts-expect-error
    const sendRequestMock = jest.spyOn(apiEntrepriseService, "sendRequest");

    jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

    beforeEach(() => {
        // @ts-expect-error requestCache is private
        apiEntrepriseService.requestCache.collection.clear();
    });

    describe("sendRequest()", () => {
        let httpGetSpy: jest.SpyInstance;
        const qsMock = jest.spyOn(qs, "stringify");

        beforeAll(() => {
            // @ts-expect-error http is protected attribute
            httpGetSpy = jest.spyOn(apiEntrepriseService.http, "get");
        });

        it("should return data", async () => {
            const expected = { test: true };
            httpGetSpy.mockResolvedValueOnce({
                status: 200,
                data: expected,
            });

            // @ts-expect-error sendRequest is private method
            const actual = await apiEntrepriseService.sendRequest("test", {}, "");

            expect(expected).toBe(actual);
        });

        it("should throw error", async () => {
            const expected = { response: { status: 404 } };
            httpGetSpy.mockImplementationOnce(async () => {
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
                recipient: "12004101700035",
            };

            const expected = [{ ...params, object: HEADCOUNT_REASON }];

            httpGetSpy.mockImplementationOnce(async () => ({
                status: 200,
                data: { test: true },
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
        const IDENTIFIER = EstablishmentIdentifier.fromSiret(SIRET, AssociationIdentifier.fromSiren(SIREN));

        afterAll(() => getEtablissementHeadcountMock.mockRestore());

        it("should look for etablissement headcount given a SIRET", async () => {
            getEtablissementHeadcountMock.mockImplementationOnce(jest.fn());
            await apiEntrepriseService.getHeadcount(IDENTIFIER);
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
                await apiEntrepriseService.getHeadcount(IDENTIFIER);
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
                await apiEntrepriseService.getHeadcount(IDENTIFIER);
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
                actual = await apiEntrepriseService.getHeadcount(IDENTIFIER);
            } catch (e) {}
            expect(actual).toEqual(expected);
        });

        it("should throw StructureIdentifiersError", async () => {
            const expected = new StructureIdentifiersError();
            getEtablissementHeadcountMock.mockImplementationOnce(jest.fn());
            let actual;
            try {
                await apiEntrepriseService.getHeadcount(AssociationIdentifier.fromSiren(SIREN));
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("getEtablissementHeadcount()", () => {
        it("should call sendRequest() with arguments", async () => {
            const HEADCOUNT_URL = "HEADCOUNT_URL";
            // @ts-expect-error: private method
            jest.spyOn(apiEntrepriseService, "buildHeadcountUrl").mockImplementationOnce(() => HEADCOUNT_URL);
            sendRequestMock.mockImplementationOnce(jest.fn());
            // @ts-expect-error
            await apiEntrepriseService.getEtablissementHeadcount(SIRET);
            expect(sendRequestMock).toHaveBeenCalledWith(HEADCOUNT_URL, {}, HEADCOUNT_REASON, false);
        });
    });

    describe("buildHeadcountUrl()", () => {
        it("should return a valid URL", () => {
            const expected = `v2/effectifs_mensuels_acoss_covid/2022/01/etablissement/${SIRET}`;
            // @ts-expect-error
            const actual = apiEntrepriseService.buildHeadcountUrl(SIRET);
            expect(actual).toEqual(expected);
        });

        it("should minus the date month", () => {
            const expected = `v2/effectifs_mensuels_acoss_covid/2021/12/etablissement/${SIRET}`;
            // @ts-expect-error
            const actual = apiEntrepriseService.buildHeadcountUrl(SIRET, 1);
            expect(actual).toEqual(expected);
        });
    });

    describe("getExtractRcs", () => {
        it("should return rcs extract", async () => {
            const expected = {};
            // @ts-expect-error
            sendRequestMock.mockImplementationOnce(async () => ({ data: expected }));
            let actual;
            try {
                actual = await apiEntrepriseService.getExtractRcs(SIREN);
            } catch (e) {
                actual = e;
            }
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

        it("should return null if axios throws", async () => {
            const expected = null;
            sendRequestMock.mockImplementationOnce(() => {
                throw new Error();
            });
            const actual = await apiEntrepriseService.getExtractRcs(SIREN);
            expect(actual).toEqual(expected);
        });
    });
});

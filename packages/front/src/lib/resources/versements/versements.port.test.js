import { NotFoundError } from "../../errors";
import versementsPort from "./versements.port";
import * as providerValueHelper from "$lib/helpers/providerValueHelper";
import requestsService from "$lib/services/requests.service";

describe("VersementsPort", () => {
    describe("getEtablissementVersements", () => {
        let getVersementsMock;

        const SIRET = "12345678900011";

        beforeAll(() => {
            getVersementsMock = vi.spyOn(versementsPort, "_getVersements");
        });

        afterAll(() => {
            getVersementsMock.mockRestore();
        });

        it('should call _getVersments with id and value of "type" is etablissement', async () => {
            const expected = [SIRET, "etablissement"];

            getVersementsMock.mockImplementationOnce(() => []);

            await versementsPort.getEtablissementVersements(SIRET);

            const actual = getVersementsMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });

        it("should return versements", async () => {
            const expected = [{ versement: 1 }, { versement: 2 }];

            getVersementsMock.mockImplementationOnce(() => expected);

            const actual = await versementsPort.getEtablissementVersements(SIRET);

            expect(actual).toBe(expected);
        });
    });

    describe("getAssociationVersements", () => {
        let getVersementsMock;

        const SIREN = "123456789";

        beforeAll(() => {
            getVersementsMock = vi.spyOn(versementsPort, "_getVersements");
        });

        afterAll(() => {
            getVersementsMock.mockRestore();
        });

        it('should call _getVersments with id and value of "type" is association', async () => {
            const expected = [SIREN, "association"];

            getVersementsMock.mockImplementationOnce(() => []);

            await versementsPort.getAssociationVersements(SIREN);

            const actual = getVersementsMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });

        it("should return versements", async () => {
            const expected = [{ versement: 1 }, { versement: 2 }];

            getVersementsMock.mockImplementationOnce(() => expected);

            const actual = await versementsPort.getAssociationVersements(SIREN);

            expect(actual).toBe(expected);
        });
    });

    describe("_getVersements", () => {
        let getMock;
        let flatenProviderValueMock;

        beforeAll(() => {
            getMock = vi.spyOn(requestsService, "get");
            flatenProviderValueMock = vi.spyOn(providerValueHelper, "flattenProviderValue");
        });

        afterAll(() => {
            getMock.mockRestore();
            flatenProviderValueMock.mockRestore();
        });

        it("should call axios with fake value type in path", async () => {
            const expected = ["/FAKE/ID/versements"];

            getMock.mockImplementationOnce(async () => ({ data: { versements: [] } }));

            await versementsPort._getVersements("ID", "FAKE");
            const actual = getMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });

        it("should return versements", async () => {
            const expected = [{ versement: 1 }, { versement: 2 }];

            getMock.mockImplementationOnce(async () => ({ data: { versements: expected } }));
            flatenProviderValueMock.mockImplementationOnce(v => v);

            const actual = await versementsPort._getVersements("ID", "FAKE");

            expect(actual).toEqual(expected);
        });

        it("should return empty versements array when api answer return an 404 error", async () => {
            const expected = 0;

            getMock.mockImplementationOnce(async () => {
                throw new NotFoundError("");
            });

            const actual = (await versementsPort._getVersements("ID", "FAKE")).length;

            expect(actual).toBe(expected);
        });

        it("should throw an when api answer return other than of 404 error", async () => {
            class FakeApiError extends Error {
                // Voir si on deplace ça !
                request = {
                    status: 999,
                };
            }

            getMock.mockImplementationOnce(async () => {
                throw new FakeApiError();
            });

            const actual = versementsPort._getVersements("ID", "FAKE");

            await expect(actual).rejects.toThrow(FakeApiError);
        });
    });
});

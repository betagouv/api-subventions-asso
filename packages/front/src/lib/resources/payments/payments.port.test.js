import { NotFoundError } from "../../errors";
import paymentsPort from "./payments.port";
import * as providerValueHelper from "$lib/helpers/providerValueHelper";
import requestsService from "$lib/services/requests.service";

describe("PaymentsPort", () => {
    describe("getEtablissementPayments", () => {
        let getPaymentsMock;

        const SIRET = "12345678900011";

        beforeAll(() => {
            getPaymentsMock = vi.spyOn(paymentsPort, "_getPayments");
        });

        afterAll(() => {
            getPaymentsMock.mockRestore();
        });

        it('should call _getPayments with id and value of "type" is etablissement', async () => {
            const expected = [SIRET, "etablissement"];

            getPaymentsMock.mockImplementationOnce(() => []);

            await paymentsPort.getEtablissementPayments(SIRET);

            const actual = getPaymentsMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });

        it("should return payments", async () => {
            const expected = [{ payment: 1 }, { payment: 2 }];

            getPaymentsMock.mockImplementationOnce(() => expected);

            const actual = await paymentsPort.getEtablissementPayments(SIRET);

            expect(actual).toBe(expected);
        });
    });

    describe("getAssociationPayments", () => {
        let getPaymentsMock;

        const SIREN = "123456789";

        beforeAll(() => {
            getPaymentsMock = vi.spyOn(paymentsPort, "_getPayments");
        });

        afterAll(() => {
            getPaymentsMock.mockRestore();
        });

        it('should call _getPayments with id and value of "type" is association', async () => {
            const expected = [SIREN, "association"];

            getPaymentsMock.mockImplementationOnce(() => []);

            await paymentsPort.getAssociationPayments(SIREN);

            const actual = getPaymentsMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });

        it("should return payments", async () => {
            const expected = [{ payment: 1 }, { payment: 2 }];

            getPaymentsMock.mockImplementationOnce(() => expected);

            const actual = await paymentsPort.getAssociationPayments(SIREN);

            expect(actual).toBe(expected);
        });
    });

    describe("_getPayments", () => {
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

        it("should call requestService with fake value type in path", async () => {
            const expected = ["/FAKE/ID/versements"];

            getMock.mockImplementationOnce(async () => ({ data: { versements: [] } }));

            await paymentsPort._getPayments("ID", "FAKE");
            const actual = getMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });

        it("should return payments", async () => {
            const expected = [{ payment: 1 }, { payment: 2 }];

            getMock.mockImplementationOnce(async () => ({ data: { versements: expected } }));
            flatenProviderValueMock.mockImplementationOnce(v => v);

            const actual = await paymentsPort._getPayments("ID", "FAKE");

            expect(actual).toEqual(expected);
        });

        it("should return empty payments array when api answer return an 404 error", async () => {
            const expected = 0;

            getMock.mockImplementationOnce(async () => {
                throw new NotFoundError("");
            });

            const actual = (await paymentsPort._getPayments("ID", "FAKE")).length;

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

            const actual = paymentsPort._getPayments("ID", "FAKE");

            await expect(actual).rejects.toThrow(FakeApiError);
        });
    });
});

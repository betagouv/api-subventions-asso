import paymentsPort from "./payments.port";
import paymentsService from "./payments.service";

describe("PaymentsService", () => {
    describe("getEtablissementPayments", () => {
        const SIRET = "12345678900011";

        let portGetEtablissementPaymentsMock;

        beforeAll(() => {
            portGetEtablissementPaymentsMock = vi.spyOn(paymentsPort, "getEtablissementPayments");
        });

        afterAll(() => {
            portGetEtablissementPaymentsMock.mockRestore();
        });

        it("should return payments", async () => {
            const expected = [{ payment: 1 }, { payment: 2 }];
            portGetEtablissementPaymentsMock.mockImplementationOnce(() => expected);

            const actual = await paymentsService.getEtablissementPayments(SIRET);

            expect(actual).toBe(expected);
        });

        it("should return 0 payments", async () => {
            const expected = [];
            portGetEtablissementPaymentsMock.mockImplementationOnce(() => expected);

            const actual = await paymentsService.getEtablissementPayments(SIRET);

            expect(actual).toBe(expected);
        });
    });

    describe("getAssociationPayments", () => {
        const SIREN = "123456789";

        let portGetAssociationPaymentsMock;

        beforeAll(() => {
            portGetAssociationPaymentsMock = vi.spyOn(paymentsPort, "getAssociationPayments");
        });

        afterAll(() => {
            portGetAssociationPaymentsMock.mockRestore();
        });

        it("should return payments", async () => {
            const expected = [{ payment: 1 }, { payment: 2 }];
            portGetAssociationPaymentsMock.mockImplementationOnce(() => expected);

            const actual = await paymentsService.getAssociationPayments(SIREN);

            expect(actual).toBe(expected);
        });

        it("should return 0 payments", async () => {
            const expected = [];
            portGetAssociationPaymentsMock.mockImplementationOnce(() => expected);

            const actual = await paymentsService.getAssociationPayments(SIREN);

            expect(actual).toBe(expected);
        });
    });
});

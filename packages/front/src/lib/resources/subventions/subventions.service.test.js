import subventionsPort from "./subventions.port";
import subventionsService from "./subventions.service";
import Store from "$lib/core/Store";

describe("SubventionsService", () => {
    describe("getEtablissementSubventions", () => {
        const SIRET = "12345678900011";

        let portGetEtablissementSubventionsMock;

        beforeAll(() => {
            portGetEtablissementSubventionsMock = vi.spyOn(subventionsPort, "getEtablissementSubventionsStore");
        });

        afterAll(() => {
            portGetEtablissementSubventionsMock.mockRestore();
        });

        it("should return subventions", async () => {
            const expected = [{ subvention: 1 }, { subvention: 2 }];
            portGetEtablissementSubventionsMock.mockImplementationOnce(() => new Store({ subventions: expected }));

            const actual = await subventionsService.getEtablissementsSubventionsStore(SIRET);

            expect(actual.value.subventions).toBe(expected);
        });

        it("should return 0 subventions", async () => {
            const expected = [];
            portGetEtablissementSubventionsMock.mockImplementationOnce(() => new Store({ subventions: expected }));

            const actual = await subventionsService.getEtablissementsSubventionsStore(SIRET);

            expect(actual.value.subventions).toBe(expected);
        });
    });

    describe("getAssociationPayments", () => {
        const SIREN = "123456789";

        let portGetAssociationPaymentsMock;

        beforeAll(() => {
            portGetAssociationPaymentsMock = vi.spyOn(subventionsPort, "getAssociationSubventionsStore");
        });

        afterAll(() => {
            portGetAssociationPaymentsMock.mockRestore();
        });

        it("should return subventions", async () => {
            const expected = [{ subvention: 1 }, { subvention: 2 }];
            portGetAssociationPaymentsMock.mockImplementationOnce(() => new Store({ subventions: expected }));

            const actual = await subventionsService.getAssociationsSubventionsStore(SIREN);

            expect(actual.value.subventions).toBe(expected);
        });

        it("should return 0 subventions", async () => {
            const expected = [];
            portGetAssociationPaymentsMock.mockImplementationOnce(() => new Store({ subventions: expected }));

            const actual = await subventionsService.getAssociationsSubventionsStore(SIREN);

            expect(actual.value.subventions).toBe(expected);
        });
    });
});

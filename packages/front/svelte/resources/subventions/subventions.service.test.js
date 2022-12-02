import subventionsPort from "./subventions.port";
import subventionsService from "./subventions.service";

describe("SubventionsService", () => {
    describe("getEtablissementSubventions", () => {
        const SIRET = "12345678900011";

        let portGetEtablissementSubventionsMock;

        beforeAll(() => {
            portGetEtablissementSubventionsMock = jest.spyOn(subventionsPort, "getEtablissementSubventionsStore");
        });

        afterAll(() => {
            portGetEtablissementSubventionsMock.mockRestore();
        });

        it("should return subventions", async () => {
            const expected = [{ subvention: 1 }, { subvention: 2 }];
            portGetEtablissementSubventionsMock.mockImplementationOnce(() => expected);

            const actual = await subventionsService.getEtablissementsSubventionsStore(SIRET);

            expect(actual).toBe(expected);
        });

        it("should return 0 subventions", async () => {
            const expected = [];
            portGetEtablissementSubventionsMock.mockImplementationOnce(() => expected);

            const actual = await subventionsService.getEtablissementsSubventionsStore(SIRET);

            expect(actual).toBe(expected);
        });
    });

    describe("getAssociationVersements", () => {
        const SIREN = "123456789";

        let portGetAssociationVersementsMock;

        beforeAll(() => {
            portGetAssociationVersementsMock = jest.spyOn(subventionsPort, "getAssociationSubventionsStore");
        });

        afterAll(() => {
            portGetAssociationVersementsMock.mockRestore();
        });

        it("should return subventions", async () => {
            const expected = [{ subvention: 1 }, { subvention: 2 }];
            portGetAssociationVersementsMock.mockImplementationOnce(() => expected);

            const actual = await subventionsService.getAssociationsSubventionsStore(SIREN);

            expect(actual).toBe(expected);
        });

        it("should return 0 subventions", async () => {
            const expected = [];
            portGetAssociationVersementsMock.mockImplementationOnce(() => expected);

            const actual = await subventionsService.getAssociationsSubventionsStore(SIREN);

            expect(actual).toBe(expected);
        });
    });
});

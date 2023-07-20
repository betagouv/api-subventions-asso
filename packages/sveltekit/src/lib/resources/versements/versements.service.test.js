import versementsPort from "./versements.port";
import versementsService from "./versements.service";

describe("VersementsService", () => {
    describe("getEtablissementVersements", () => {
        const SIRET = "12345678900011";

        let portGetEtablissementVersementsMock;

        beforeAll(() => {
            portGetEtablissementVersementsMock = jest.spyOn(versementsPort, "getEtablissementVersements");
        });

        afterAll(() => {
            portGetEtablissementVersementsMock.mockRestore();
        });

        it("should return versements", async () => {
            const expected = [{ versement: 1 }, { versement: 2 }];
            portGetEtablissementVersementsMock.mockImplementationOnce(() => expected);

            const actual = await versementsService.getEtablissementVersements(SIRET);

            expect(actual).toBe(expected);
        });

        it("should return 0 versements", async () => {
            const expected = [];
            portGetEtablissementVersementsMock.mockImplementationOnce(() => expected);

            const actual = await versementsService.getEtablissementVersements(SIRET);

            expect(actual).toBe(expected);
        });
    });

    describe("getAssociationVersements", () => {
        const SIREN = "123456789";

        let portGetAssociationVersementsMock;

        beforeAll(() => {
            portGetAssociationVersementsMock = jest.spyOn(versementsPort, "getAssociationVersements");
        });

        afterAll(() => {
            portGetAssociationVersementsMock.mockRestore();
        });

        it("should return versements", async () => {
            const expected = [{ versement: 1 }, { versement: 2 }];
            portGetAssociationVersementsMock.mockImplementationOnce(() => expected);

            const actual = await versementsService.getAssociationVersements(SIREN);

            expect(actual).toBe(expected);
        });

        it("should return 0 versements", async () => {
            const expected = [];
            portGetAssociationVersementsMock.mockImplementationOnce(() => expected);

            const actual = await versementsService.getAssociationVersements(SIREN);

            expect(actual).toBe(expected);
        });
    });
});

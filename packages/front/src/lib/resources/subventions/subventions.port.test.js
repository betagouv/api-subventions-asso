import subventionsPort from "./subventions.port";

describe("SubventionPort", () => {
    describe("getEtablissementPayments", () => {
        let getSubventionStoreMock;

        const SIRET = "12345678900011";

        beforeAll(() => {
            getSubventionStoreMock = vi.spyOn(subventionsPort, "_getSubventionsConnectedStore");
        });

        afterAll(() => {
            getSubventionStoreMock.mockRestore();
        });

        it('should call _getSubventionsConnectedStore with id and value of "type" is etablissement', () => {
            const expected = [SIRET, "etablissement"];

            getSubventionStoreMock.mockImplementationOnce(() => []);

            subventionsPort.getEtablissementSubventionsStore(SIRET);

            const actual = getSubventionStoreMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });

        it("should return subventions", () => {
            const expected = [{ subvention: 1 }, { subvention: 2 }];

            getSubventionStoreMock.mockImplementationOnce(() => expected);

            const actual = subventionsPort.getEtablissementSubventionsStore(SIRET);

            expect(actual).toBe(expected);
        });
    });

    describe("getAssociationPayments", () => {
        let getSubventionStoreMock;

        const SIREN = "123456789";

        beforeAll(() => {
            getSubventionStoreMock = vi.spyOn(subventionsPort, "_getSubventionsConnectedStore");
        });

        afterAll(() => {
            getSubventionStoreMock.mockRestore();
        });

        it('should call _getSubventionsConnectedStore with id and value of "type" is association', () => {
            const expected = [SIREN, "association"];

            getSubventionStoreMock.mockImplementationOnce(() => []);

            subventionsPort.getAssociationSubventionsStore(SIREN);

            const actual = getSubventionStoreMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });

        it("should return subventions", () => {
            const expected = [{ subvention: 1 }, { subvention: 2 }];

            getSubventionStoreMock.mockImplementationOnce(() => expected);

            const actual = subventionsPort.getAssociationSubventionsStore(SIREN);

            expect(actual).toBe(expected);
        });
    });
});

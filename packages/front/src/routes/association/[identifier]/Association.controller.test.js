import { AssociationController } from "./Association.controller";
import associationService from "$lib/resources/associations/association.service";
import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";

vi.mock("$lib/resources/associations/association.service");
vi.mock("$lib/store/association.store", () => ({
    currentAssociation: { set: vi.fn() },
    currentAssoSimplifiedEtabs: { set: vi.fn() },
}));

describe("Association Controller", () => {
    const SIREN = "123456789";
    let controller;

    beforeAll(() => {
        associationService.getEstablishments.mockResolvedValue([]);
        associationService.getAssociation.mockResolvedValue({});
    });

    beforeEach(() => {
        controller = new AssociationController(SIREN);
    });

    describe("constructor", () => {
        describe.each`
            name                           | promise                             | service                | store                         | result
            ${"association"}               | ${"associationPromise"}             | ${"getAssociation"}    | ${currentAssociation}         | ${{}}
            ${"simplified establishments"} | ${"simplifiedEstablishmentPromise"} | ${"getEstablishments"} | ${currentAssoSimplifiedEtabs} | ${[]}
        `("$name", ({ promise, service, store, result }) => {
            it("gets resource", async () => {
                await controller[promise];
                expect(associationService[service]).toHaveBeenCalledWith(SIREN);
            });

            it("sets store with received resource", async () => {
                await controller[promise];
                expect(store.set).toHaveBeenCalledWith(result);
            });
        });
    });
});

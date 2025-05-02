import { EstablishmentController } from "./Establishment.controller";
import associationService from "$lib/resources/associations/association.service";
import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";
import establishmentService from "$lib/resources/establishments/establishment.service";
import rnaSirenService from "$lib/resources/open-source/rna-siren/rna-siren.service";

vi.mock("$lib/resources/associations/association.service");
vi.mock("$lib/resources/establishments/establishment.service");
vi.mock("$lib/resources/open-source/rna-siren/rna-siren.service");
vi.mock("$lib/store/association.store", () => ({
    currentAssociation: { set: vi.fn() },
    currentAssoSimplifiedEtabs: { set: vi.fn() },
    currentIdentifiers: { set: vi.fn() },
}));

describe("Establishment Controller", () => {
    const SIRET = "12345678900000";
    const SIREN = "123456789";
    let controller;

    beforeAll(() => {
        vi.mocked(associationService.getEstablishments).mockResolvedValue([]);
        // @ts-expect-error: mock
        vi.mocked(associationService.getAssociation).mockResolvedValue({});
        vi.mocked(establishmentService.getBySiret).mockResolvedValue({});
        vi.mocked(rnaSirenService.getAssociatedIdentifier).mockResolvedValue([]);
    });

    beforeEach(() => {
        controller = new EstablishmentController(SIRET);
    });

    describe("constructor", () => {
        describe.each`
            name                           | service                | store                         | result
            ${"association"}               | ${"getAssociation"}    | ${currentAssociation}         | ${{}}
            ${"simplified establishments"} | ${"getEstablishments"} | ${currentAssoSimplifiedEtabs} | ${[]}
        `("$name", ({ service, store, result }) => {
            it("gets resource", async () => {
                await controller.promises;
                expect(associationService[service]).toHaveBeenCalledWith(SIREN);
            });

            it("sets store with received resource", async () => {
                await controller.promises;
                expect(store.set).toHaveBeenCalledWith(result);
            });
        });

        describe("etablissement", () => {
            it("gets resource", async () => {
                await controller.promises;
                expect(establishmentService.getBySiret).toHaveBeenCalledWith(SIRET);
            });

            it("returns received resource", async () => {
                const expected = {};
                await controller.promises;
                const actual = (await controller.promises).establishment;
                expect(actual).toEqual(expected);
            });
        });
    });
});

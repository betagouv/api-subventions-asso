vi.mock("svelte", async originalImport => {
    return {
        ...(await originalImport()),
        onDestroy: vi.fn(),
    };
});
import { AssociationController } from "./Association.controller";
import associationService from "$lib/resources/associations/association.service";
import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";
import rnaSirenService from "$lib/resources/open-source/rna-siren/rna-siren.service";
vi.mock("$lib/resources/open-source/rna-siren/rna-siren.service");
const mockedRnaSirenService = vi.mocked(rnaSirenService);

vi.mock("$lib/resources/associations/association.service");
vi.mock("$lib/store/association.store", () => ({
    currentAssociation: { set: vi.fn() },
    currentAssoSimplifiedEtabs: { set: vi.fn() },
    currentIdentifiers: { set: vi.fn() },
}));

describe("Association Controller", () => {
    const RNA_SIREN = { rna: "RNA", siren: "SIREN", id: "QZO24DK32QKD" };
    const SIREN = "123456789";
    let controller;

    beforeAll(() => {
        vi.mocked(associationService.getEstablishments).mockResolvedValue([]);
        // @ts-expect-error: mock response
        vi.mocked(associationService.getAssociation).mockResolvedValue({});
        mockedRnaSirenService.getAssociatedIdentifier.mockResolvedValue([RNA_SIREN]);
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

    describe("getRnaSirenDuplicates()", () => {
        const RNA_SIREN_2 = { rna: RNA_SIREN.rna, siren: "SIREN_2", id: "QNCQZ9822N49" };
        const RNA_SIREN_3 = { rna: "RNA_2", siren: RNA_SIREN.siren, id: "MZD92Z0jj0àç" };
        const mockGetAssociatedIdentifier = vi.fn(async () => [RNA_SIREN]);
        beforeAll(() => mockedRnaSirenService.getAssociatedIdentifier.mockImplementation(mockGetAssociatedIdentifier));

        it("should set duplicates from RNA", async () => {
            mockedRnaSirenService.getAssociatedIdentifier.mockImplementationOnce(async () => [RNA_SIREN, RNA_SIREN_2]);
            controller.getRnaSirenDuplicates("RNA", "SIREN");
            // wait for async mocked function to resolve
            await new Promise(process.nextTick);
            expect(controller.duplicatesFromRna.value).toEqual([RNA_SIREN.siren, RNA_SIREN_2.siren]);
        });

        it("should set duplicates from SIREN", async () => {
            mockedRnaSirenService.getAssociatedIdentifier.mockImplementationOnce(async () => [RNA_SIREN]);
            mockedRnaSirenService.getAssociatedIdentifier.mockImplementationOnce(async () => [RNA_SIREN, RNA_SIREN_3]);
            controller.getRnaSirenDuplicates("RNA", "SIREN");
            // wait for async mocked function to resolve
            await new Promise(process.nextTick);
            expect(controller.duplicatesFromSiren.value).toEqual([RNA_SIREN.rna, RNA_SIREN_3.rna]);
        });
    });
});

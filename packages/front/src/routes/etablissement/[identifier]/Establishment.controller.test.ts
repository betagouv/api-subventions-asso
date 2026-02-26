import { EstablishmentController } from "./Establishment.controller";
import associationService from "$lib/resources/associations/association.service";
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
    const RNA = "W90000001";

    let mockGetEstablishments, mockGetAssociation, mockGetBySiret, mockGetAssociatedIdentifier;

    beforeEach(() => {
        mockGetEstablishments = vi.spyOn(associationService, "getEstablishments").mockResolvedValue([]);
        // @ts-expect-error: mock
        mockGetAssociation = vi.spyOn(associationService, "getAssociation").mockResolvedValue({});
        mockGetBySiret = vi.spyOn(establishmentService, "getBySiret").mockResolvedValue({});
        mockGetAssociatedIdentifier = vi
            .spyOn(rnaSirenService, "getAssociatedIdentifier")
            .mockResolvedValue([{ siren: SIREN, rna: RNA }]);
    });

    describe("constructor", () => {
        const mockInit = vi.fn();
        const originalInit = EstablishmentController.prototype.init;
        beforeEach(() => {
            EstablishmentController.prototype.init = mockInit;
        });

        afterAll(() => (EstablishmentController.prototype.init = originalInit));

        it("init class", () => {
            new EstablishmentController(SIRET);
            expect(mockInit).toHaveBeenCalledTimes(1);
        });
    });

    // init is called in construcor
    describe("init", () => {
        it("retrieve association information", async () => {
            await new EstablishmentController(SIRET).promises;
            expect(mockGetAssociation).toHaveBeenCalledWith(RNA);
        });

        it("retrieve association information from siren if no rna was found", async () => {
            mockGetAssociatedIdentifier.mockResolvedValueOnce(null);
            await new EstablishmentController(SIRET).promises;
            expect(mockGetAssociation).toHaveBeenCalledWith(SIREN);
        });

        it("retrieve establishments information", async () => {
            await new EstablishmentController(SIRET).promises;
            expect(mockGetEstablishments).toHaveBeenCalledWith(RNA);
        });
        it("retrieve establishment information", async () => {
            await new EstablishmentController(SIRET).promises;
            expect(mockGetBySiret).toHaveBeenCalledWith(SIRET);
        });
    });
});

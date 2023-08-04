import { AssociationController } from "./Association.controller";
import associationService from "$lib/resources/associations/association.service";

describe("Association Controller", () => {
    const SIREN = "123456789";
    const RNA = "W12345678";
    let controller;

    const mockGetAssociation = vi.spyOn(associationService, "getAssociation");

    beforeEach(() => {
        controller = new AssociationController(SIREN);
    });

    /* eslint-disable vitest/no-commented-out-tests -- because of TODO */
    /* TODO
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    describe("constructor", () => {});
    */
    /* eslint-enable vitest/no-commented-out-tests -- because of TODO */

    describe("isAssociation()", () => {
        it("should return true", () => {
            mockGetAssociation.mockImplementationOnce(() => ({ rna: RNA, categorie_juridique: "" }));
            const expected = true;
            const actual = controller.isAssociation();
            expect(actual).toEqual(expected);
        });

        it("should return false with no RNA", () => {
            mockGetAssociation.mockImplementationOnce(() => ({ rna: RNA }));
            const expected = false;
            const actual = controller.isAssociation();
            expect(actual).toEqual(expected);
        });

        it("should return false if no categorie_juridique", () => {
            mockGetAssociation.mockImplementationOnce(() => ({ categorie_juridique: "" }));
            const expected = false;
            const actual = controller.isAssociation();
            expect(actual).toEqual(expected);
        });
    });
});

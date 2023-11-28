import { AssociationController } from "./Association.controller";
import { isAssociation } from "$lib/helpers/entrepriseHelper.js";

vi.mock("$lib/helpers/entrepriseHelper.js");

describe("Association Controller", () => {
    const SIREN = "123456789";
    const RNA = "W12345678";
    let controller;

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
            const ASSO = { rna: RNA, categorie_juridique: "" };
            const expected = true;
            const actual = controller.isAssociation(ASSO);
            expect(actual).toEqual(expected);
        });

        it("should return true if only rna", () => {
            const ASSO = { rna: RNA };
            const expected = true;
            const actual = controller.isAssociation(ASSO);
            expect(actual).toEqual(expected);
        });

        it("should return true if no rna but proper 'categorie_juridique'", () => {
            isAssociation.mockReturnValueOnce(true);
            const ASSO = { categorie_juridique: "" };
            const expected = true;
            const actual = controller.isAssociation(ASSO);
            expect(actual).toEqual(expected);
        });

        it("should return false if neither rna nor proper 'categorie_juridique'", () => {
            isAssociation.mockReturnValueOnce(false);
            const ASSO = { categorie_juridique: "" };
            const expected = false;
            const actual = controller.isAssociation(ASSO);
            expect(actual).toEqual(expected);
        });
    });
});

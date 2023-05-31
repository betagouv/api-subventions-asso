import { AssociationController } from "./Association.controller";
import associationService from "@resources/associations/association.service";
import * as ContextStore from "@store/context.store";
jest.mock("@store/context.store");

describe("Association Controller", () => {
    const SIREN = "123456789";
    const RNA = "W12345678";
    let controller;

    const mockGetAssociation = jest.spyOn(associationService, "getAssociation");

    beforeEach(() => {
        controller = new AssociationController(SIREN);
    });

    afterEach(() => ContextStore.activeBlueBanner.mockReset());

    describe("constructor", () => {
        it("should call activeBlueBanner", () => {
            expect(ContextStore.activeBlueBanner).toHaveBeenCalledTimes(1);
        });
    });

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

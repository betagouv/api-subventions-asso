import AssociationTagController, { type AssociationTagAssociation } from "./AssociationTag.controller";

describe("AssociationTagController", () => {
    const simplifiedAsso = {
        name: "Association test",
        rna: "W123456789",
        siren: "123456789",
    } satisfies AssociationTagAssociation;

    describe("url", () => {
        it("uses rna first for association page url", () => {
            const ctrl = new AssociationTagController(simplifiedAsso);

            expect(ctrl.url).toBe("/association/W123456789");
        });

        it("falls back to siren for association page url", () => {
            const ctrl = new AssociationTagController({ name: simplifiedAsso.name, siren: simplifiedAsso.siren });

            expect(ctrl.url).toBe("/association/123456789");
        });
    });

    describe("label", () => {
        it("uses siren as visible identifier", () => {
            const ctrl = new AssociationTagController(simplifiedAsso);

            expect(ctrl.label).toBe("Association test - 123456789");
        });

        it("falls back to rna as visible identifier", () => {
            const ctrl = new AssociationTagController({ name: simplifiedAsso.name, rna: simplifiedAsso.rna });

            expect(ctrl.label).toBe("Association test - W123456789");
        });

        it("uses only the name when no identifier is available", () => {
            const ctrl = new AssociationTagController({ name: simplifiedAsso.name });

            expect(ctrl.label).toBe("Association test");
        });
    });
});

import * as ApplicationHelper from "./application.helper";

describe("Application Helper", () => {
    describe("bypassInstructor", () => {
        const SCDL_PROVIDER = "scdl-75218622100012";
        const OTHER_PROVIDER = "osiris";

        it("returns true if fournisseur starting with scdl-", () => {
            const expected = true;
            // @ts-expect-error: partial application flat
            const actual = ApplicationHelper.bypassInstructor({ fournisseur: SCDL_PROVIDER });
            expect(actual).toEqual(expected);
        });

        it("returns true if fournisseur is helios", () => {
            const expected = true;
            // @ts-expect-error: partial application flat
            const actual = ApplicationHelper.bypassInstructor({ fournisseur: "helios" });
            expect(actual).toEqual(expected);
        });

        it("returns false if fournisseur does not start with scdl-", () => {
            const expected = false;
            // @ts-expect-error: partial application flat
            const actual = ApplicationHelper.bypassInstructor({ fournisseur: OTHER_PROVIDER });
            expect(actual).toEqual(expected);
        });
    });
});

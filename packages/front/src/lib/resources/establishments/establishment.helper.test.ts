import * as EstablishmentHelper from "./establishment.helper";

describe("EstablishmentHelper", () => {
    describe("getStatusBadgeOptions", () => {
        it("should return null", () => {
            const actual = EstablishmentHelper.getStatusBadgeOptions({});
            const expected = null;
            expect(actual).toEqual(expected);
        });

        it("should return open option", () => {
            const actual = EstablishmentHelper.getStatusBadgeOptions({ ouvert: true });
            const expected = { label: "Ouvert", type: "success" };
            expect(actual).toEqual(expected);
        });

        it("should return close option", () => {
            const actual = EstablishmentHelper.getStatusBadgeOptions({ ouvert: false });
            const expected = { label: "Fermé", type: "error" };
            expect(actual).toEqual(expected);
        });
    });
});

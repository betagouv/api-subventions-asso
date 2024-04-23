import { ObjectId } from "mongodb";
import BopAdapter from "./bop.adapter";

describe("Bop Adapter", () => {
    const PROGRAMME = {
        label_theme: "Justice",
        label: "Accès au droit et à la justice",
        code_ministere: "MIN10",
        description: null,
        code: "101",
    };

    describe("toDbo()", () => {
        it("should return BopDbo", () => {
            const expected = { _id: expect.any(ObjectId), label: PROGRAMME.label, code: PROGRAMME.code };
            const actual = BopAdapter.toDbo(PROGRAMME);
            expect(actual).toEqual(expected);
        });
    });
});

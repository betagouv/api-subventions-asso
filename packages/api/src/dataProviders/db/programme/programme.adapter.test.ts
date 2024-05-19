import { ObjectId } from "mongodb";
import ProgrammeAdapter from "./programme.adapter";

describe("Programme Adapter", () => {
    const PROGRAMME = {
        label_theme: "Justice",
        label: "Accès au droit et à la justice",
        code_ministere: "MIN10",
        description: null,
        code: "101",
    };

    describe("toDbo()", () => {
        it("should return ProgrammeDbo", () => {
            const expected = { _id: expect.any(ObjectId), ...PROGRAMME };
            const actual = ProgrammeAdapter.toDbo(PROGRAMME);
            expect(actual).toEqual(expected);
        });
    });
});

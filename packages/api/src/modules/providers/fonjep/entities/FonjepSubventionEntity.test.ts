import FonjepSubventionEntity from "./FonjepSubventionEntity";

describe("FonjepSubventionEntity", () => {
    describe("getBopFromFounderCode", () => {
        it.each`
            code         | expected
            ${"10012"}   | ${361}
            ${undefined} | ${undefined}
        `("should return value", ({ code, expected }) => {
            // @ts-expect-error: private static method
            const actual = FonjepSubventionEntity.getBopFromFounderCode(code);
            expect(actual).toEqual(expected);
        });
    });
});

import * as ValidatorService from "./validator.service";

describe("validator service", () => {
    describe("checkPassword", () => {
        it.each`
            condition                  | attemptedPwd
            ${"digit"}                 | ${"testPassword."}
            ${"lowercase letter"}      | ${"TESTPASS0RD."}
            ${"uppercase letter"}      | ${"testpassw0rd."}
            ${"special character"}     | ${"testPassw0rd"}
            ${"at least 8 characters"} | ${"te5tPa."}
            ${"at most 32 characters"} | ${"testPassw0rd.1234567890$poiuytre4"}
        `("rejects that don't contain $condition", ({ attemptedPwd }) => {
            const expected = false;
            const actual = ValidatorService.checkPassword(attemptedPwd);
            expect(actual).toBe(expected);
        });

        it("accepts proper password", () => {
            const expected = true;
            const actual = ValidatorService.checkPassword("testPass0rd.");
            expect(actual).toBe(expected);
        });
    });
});

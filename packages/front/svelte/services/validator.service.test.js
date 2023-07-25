import * as ValidatorService from "./validator.service";

describe("validator service", () => {
    describe("checkPassword", () => {
        it("should return false if no number", () => {
            const PASSWORD = "ABCdef@!";
            const expected = false;
            const actual = ValidatorService.checkPassword(PASSWORD);
            expect(actual).toEqual(expected);
        });

        it("should return false if no capital letter", () => {
            const PASSWORD = "123abc@!";
            const expected = false;
            const actual = ValidatorService.checkPassword(PASSWORD);
            expect(actual).toEqual(expected);
        });

        it("should return false if no lowercase letter", () => {
            const PASSWORD = "123ABC@!";
            const expected = false;
            const actual = ValidatorService.checkPassword(PASSWORD);
            expect(actual).toEqual(expected);
        });

        it("should return false if no special character", () => {
            const PASSWORD = "123ABCdef";
            const expected = false;
            const actual = ValidatorService.checkPassword(PASSWORD);
            expect(actual).toEqual(expected);
        });

        it("should return false if length less than 8 character", () => {
            const PASSWORD = "12ABde!";
            const expected = false;
            const actual = ValidatorService.checkPassword(PASSWORD);
            expect(actual).toEqual(expected);
        });
    });
});

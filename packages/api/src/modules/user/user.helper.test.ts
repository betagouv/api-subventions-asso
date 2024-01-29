import { getNewJwtExpireDate } from "./user.helper";

jest.useFakeTimers().setSystemTime(new Date("2024-01-01"));

describe("UserHelper", () => {
    describe("getNewJwtExpireDate", () => {
        it("should return a valid jwt expire date", () => {
            // two days after today
            const expected = new Date("2024-01-03");
            const actual = getNewJwtExpireDate();
            expect(actual).toEqual(expected);
        });
    });
});

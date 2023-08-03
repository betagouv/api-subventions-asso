import * as UserService from "./user.service";

describe("user.service", () => {
    const USER = {
        roles: ["user"],
    };
    describe("isAdmin", () => {
        it("should return true", () => {
            const expected = true;
            const actual = UserService.isAdmin({ ...USER, roles: ["user", "admin"] });
            expect(actual).toEqual(expected);
        });
        it("should return false", () => {
            const expected = false;
            const actual = UserService.isAdmin(USER);
            expect(actual).toEqual(expected);
        });
    });
});

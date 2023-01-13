import { isRequestFromAdmin } from "./HttpHelper";

describe("isRequestFromAdmin()", () => {
    const STD_USER = { roles: ["user"] };
    const ADMIN_USER = { roles: ["admin", "user"] };
    const requestWithUser = user => ({ user });
    it("should return true if from admin", () => {
        const expected = true;
        // @ts-expect-error mock
        const actual = isRequestFromAdmin(requestWithUser(ADMIN_USER));
        expect(actual).toEqual(expected);
    });

    it("should return false if not from admin", () => {
        const expected = false;
        // @ts-expect-error mock
        const actual = isRequestFromAdmin(requestWithUser(STD_USER));
        expect(actual).toEqual(expected);
    });

    it("should return false if no user in request", () => {
        const expected = false;
        // @ts-expect-error mock
        const actual = isRequestFromAdmin(requestWithUser({}));
        expect(actual).toEqual(expected);
    });
});

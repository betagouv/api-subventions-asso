import { ONE_DAY_MS } from "./DateHelper";
import * as UserHelper from "./UserHelper";

describe("UserHelper", () => {
    describe("isUserActif", () => {
        const ONE_WEEK_MS = ONE_DAY_MS * 7;
        const LAST_WEEK = new Date(Date.now() - (ONE_WEEK_MS + 1));

        it.each`
            user
            ${{ stats: { lastSearchDate: null } }}
            ${{ stats: { lastSearchDate: LAST_WEEK } }}
        `("should return false", ({ user }) => {
            const expected = false;
            const actual = UserHelper.isUserActif(user);
            expect(actual).toEqual(expected);
        });
    });
});

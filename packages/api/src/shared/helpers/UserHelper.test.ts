import * as UserHelper from "./UserHelper";
import statsService from "../../modules/stats/stats.service";

describe("UserHelper", () => {
    describe("isUserActif", () => {
        const mockGetLastSearchDate = jest.spyOn(statsService, "getUserLastSearchDate");

        it("should return false", async () => {
            const expected = false;
            mockGetLastSearchDate.mockImplementationOnce(async () => null);
            // @ts-expect-error: mock user
            const actual = await UserHelper.isUserActif({ _id: "ID" });
            expect(actual).toEqual(expected);
        });

        it("should return true", async () => {
            const expected = true;
            mockGetLastSearchDate.mockImplementationOnce(async () => new Date());
            // @ts-expect-error: dmock user
            const actual = await UserHelper.isUserActif({ _id: "ID" });
            expect(actual).toEqual(expected);
        });
    });
});

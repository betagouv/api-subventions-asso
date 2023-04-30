import { ObjectId, WithId } from "mongodb";
import { ONE_DAY_MS } from "./DateHelper";
import * as UserHelper from "./UserHelper";
import statsAssociationsVisitRepository from "../../modules/stats/repositories/statsAssociationsVisit.repository";

describe("UserHelper", () => {
    describe("isUserActif", () => {
        const mockGetLastSearchDate = jest.spyOn(statsAssociationsVisitRepository, "getLastSearchDate");

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

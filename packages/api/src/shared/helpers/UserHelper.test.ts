import * as UserHelper from "./UserHelper";
import statsService from "../../modules/stats/stats.service";
import { ObjectId } from "mongodb";
import { RoleEnum } from "../../@enums/RolesEnum";
import { UserDto } from "dto";

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

    describe("isUserAdmin", () => {
        it("should return true", async () => {
            const expected = true;
            const actual = UserHelper.isUserAdmin({
                _id: new ObjectId(),
                roles: [RoleEnum.user, RoleEnum.admin],
            } as unknown as UserDto);
            expect(actual).toEqual(expected);
        });

        it("should return false", async () => {
            const expected = false;
            const actual = UserHelper.isUserAdmin({
                _id: new ObjectId(),
                roles: [RoleEnum.user],
            } as unknown as UserDto);
            expect(actual).toEqual(expected);
        });
    });
});

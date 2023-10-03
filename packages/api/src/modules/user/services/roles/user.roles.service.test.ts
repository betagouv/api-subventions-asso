import { RoleEnum } from "../../../../@enums/Roles";
import userRolesService from "./user.roles.service";

describe("user roles service", () => {
    describe("isRoleValid", () => {
        it("should return true", () => {
            const expected = true;
            const role = RoleEnum.consumer;
            const actual = userRolesService.isRoleValid(role);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const expected = false;
            const actual = userRolesService.isRoleValid("not-a-role");
            expect(actual).toEqual(expected);
        });
    });

    describe("validRoles", () => {
        it("should return true", () => {
            const roles = [RoleEnum.admin, RoleEnum.user];
            const expected = true;
            const actual = userRolesService.validRoles(roles);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const roles = ["foo", RoleEnum.user];
            const expected = false;
            const actual = userRolesService.validRoles(roles);
            expect(actual).toEqual(expected);
        });
    });
});

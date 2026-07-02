import { RoleEnum } from "../../../../domain/users/@types/UserRoles";
import userRolesService from "./user.roles.service";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { USER_ENTITY } from "../../__fixtures__/user.fixture";
import UserEntity from "../../../../domain/users/UserEntity";

jest.mock("../../../../adapters/outputs/db/user/user.adapter");

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

    describe("addRolesToUser", () => {
        beforeAll(() => {
            jest.spyOn(userAdapter, "findByEmail").mockResolvedValue(USER_ENTITY);
        });

        it("should throw error if given role is not valid", async () => {
            const ROLE = "not-a-role";
            // @ts-expect-error: wrong value
            await expect(async () => userRolesService.addRolesToUser(USER_ENTITY.email, [ROLE])).rejects.toThrow(
                new Error(`Role ${ROLE} is not valid`),
            );
        });

        it("should call userPort.update()", async () => {
            await userRolesService.addRolesToUser(USER_EMAIL, [RoleEnum.admin]);
            expect(userAdapter.update).toHaveBeenCalledWith(
                new UserEntity({
                    ...USER_ENTITY,
                    roles: [...USER_ENTITY.roles, RoleEnum.admin],
                }),
            );
        });
    });
});

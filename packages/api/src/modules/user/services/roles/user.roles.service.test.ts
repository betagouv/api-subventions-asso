import { RoleEnum } from "../../../../@enums/Roles";
import { BadRequestError, InternalServerError } from "core";
import userRolesService from "./user.roles.service";
import userPort from "../../../../dataProviders/db/user/user.port";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
jest.mock("../../../../dataProviders/db/user/user.port");
const mockedUserPort = jest.mocked(userPort);

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
        afterAll(() => mockedUserPort.findByEmail.mockReset());

        it("should throw InternalServerError if user email not found", async () => {
            mockedUserPort.findByEmail.mockImplementationOnce(async () => null);
            const expected = new InternalServerError("An error has occurred");
            let actual;
            try {
                actual = await userRolesService.addRolesToUser("wrong@email.fr", [RoleEnum.admin]);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });

        it("should throw BadRequestError if role not found", async () => {
            const ROLE = "adm";
            const expected = new BadRequestError(`Role ${ROLE} is not valid`);
            // @ts-expect-error: wrong value
            expect(() => userRolesService.addRolesToUser(USER_WITHOUT_SECRET, [ROLE])).rejects.toThrowError(expected);
        });

        it("should call userPort.update() with user as argument", async () => {
            await userRolesService.addRolesToUser(USER_WITHOUT_SECRET, [RoleEnum.admin]);
            expect(mockedUserPort.update).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                roles: [...USER_WITHOUT_SECRET.roles, RoleEnum.admin],
            });
        });

        it("should call userPort.update() with email as argument", async () => {
            mockedUserPort.findByEmail.mockImplementationOnce(async email => USER_WITHOUT_SECRET);
            await userRolesService.addRolesToUser(USER_EMAIL, [RoleEnum.admin]);
            expect(mockedUserPort.update).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                roles: [...USER_WITHOUT_SECRET.roles, RoleEnum.admin],
            });
        });
    });
});

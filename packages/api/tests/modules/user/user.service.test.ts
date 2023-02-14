//TODO: transform this in unit test (src/modules/user/user.service.test.ts) or move it to user.spec.ts

import UserDto from "@api-subventions-asso/dto/user/UserDto";
import { ObjectId } from "mongodb";
import { RoleEnum } from "../../../src/@enums/Roles";
import UserReset from "../../../src/modules/user/entities/UserReset";
import userResetRepository from "../../../src/modules/user/repositories/user-reset.repository";
import userRepository from "../../../src/modules/user/repositories/user.repository";
import { UserService, UserServiceErrors } from "../../../src/modules/user/user.service";
import { ResetPasswordErrorCodes } from "@api-subventions-asso/dto";
import dedent from "dedent";

describe("user.service.ts", () => {
    let service;
    beforeEach(async () => {
        service = new UserService();
    });

    describe("findByEmail", () => {
        beforeEach(async () => {
            await service.createUser("test@beta.gouv.fr");
        });

        it("should be return user", async () => {
            await expect(service.findByEmail("test@beta.gouv.fr")).resolves.toMatchObject({
                email: "test@beta.gouv.fr"
            });
        });
        it("should be return null", async () => {
            await expect(service.findByEmail("testAA@beta.gouv.fr")).resolves.toBe(null);
        });
    });

    describe("createUser", () => {
        it("should reject because email is not valid", async () => {
            await expect(service.createUser("test[at]beta.gouv.fr")).rejects.toMatchObject({
                message: "Email is not valid",
                code: UserServiceErrors.CREATE_INVALID_EMAIL
            });
        });
        it("should reject because user already exist", async () => {
            await service.createUser("test@beta.gouv.fr");
            const test = async () => await service.createUser("test@beta.gouv.fr");
            await expect(test).rejects.toMatchObject({
                message: "User is already exist",
                code: UserServiceErrors.CREATE_USER_ALREADY_EXIST
            });
        });
        it("should reject because password is not valid", async () => {
            const test = async () => await service.createUser("test@beta.gouv.fr", [RoleEnum.user], "aa");
            await expect(test).rejects.toMatchSnapshot();
        });

        it("should return created user", async () => {
            await expect(service.createUser("test@beta.gouv.fr")).resolves.toMatchObject({
                email: "test@beta.gouv.fr",
                active: false,
                roles: ["user"]
            });
        });
    });

    describe("addUsersByCsv", () => {
        const csv = `test@beta.gouv.fr;\ntest2@beta.gouv.fr;`;
        const buffer = Buffer.from(csv);

        it("should call createUsersByList with 2 email", async () => {
            const mock = jest.spyOn(service, "createUsersByList").mockImplementationOnce(() => null);

            await service.addUsersByCsv(buffer);

            expect(mock).toHaveBeenCalledWith(["test@beta.gouv.fr", "test2@beta.gouv.fr"]);
            mock.mockClear();
        });
    });

    describe("createUsersByList", () => {
        it("should create two users", async () => {
            const result = await service.createUsersByList(["test@beta.gouv.fr", "test2@beta.gouv.fr"]);
            expect(result).toHaveLength(2);
            expect(result.every(r => r != null)).toBe(true);
        });

        it("should create one user and reject one other user", async () => {
            await service.createUser("test@beta.gouv.fr");
            const result = await service.createUsersByList(["test@beta.gouv.fr", "test2@beta.gouv.fr"]);
            expect(result).toHaveLength(1);
            expect(result.every(r => r != null)).toBe(true);
        });
    });

    describe("addRolesToUser", () => {
        beforeEach(async () => {
            await service.createUser("test@beta.gouv.fr");
        });

        it("should reject because user email not found", async () => {
            await expect(service.addRolesToUser("wrong@email.fr", [RoleEnum.admin])).resolves.toMatchObject({
                success: false,
                message: "User email does not correspond to a user",
                code: UserServiceErrors.USER_NOT_FOUND
            });
        });

        it("should reject because role not found", async () => {
            await expect(service.addRolesToUser("test@beta.gouv.fr", ["CHEF"])).resolves.toMatchObject({
                success: false,
                message: `The role "CHEF" does not exist`,
                code: UserServiceErrors.ROLE_NOT_FOUND
            });
        });

        it("should update user (called with email)", async () => {
            await expect(service.addRolesToUser("test@beta.gouv.fr", [RoleEnum.admin])).resolves.toMatchObject({
                success: true,
                user: { roles: ["user", "admin"] }
            });
        });

        it("should update user (called with user)", async () => {
            const user = (await service.findByEmail("test@beta.gouv.fr")) as UserDto;
            await expect(service.addRolesToUser(user, [RoleEnum.admin])).resolves.toMatchObject({
                success: true,
                user: { roles: ["user", "admin"] }
            });
        });
    });

    describe("activeUser", () => {
        beforeEach(async () => {
            await service.createUser("test@beta.gouv.fr");
        });

        it("should reject because user email not found", async () => {
            const expected = {
                success: false,
                message: "User email does not correspond to a user",
                code: UserServiceErrors.USER_NOT_FOUND
            };
            let actual;
            try {
                actual = await service.activeUser("wrong@email.fr");
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });

        it("should update user (called with email)", async () => {
            const expected = {
                success: true,
                user: { active: true }
            };
            const actual = await service.activeUser("test@beta.gouv.fr");
            expect(actual).toMatchObject(expected);
        });

        it("should update user (called with user)", async () => {
            const expected = { success: true, user: { active: true } };
            const user = (await service.findByEmail("test@beta.gouv.fr")) as UserDto;
            const actual = await service.activeUser(user);
            expect(actual).toMatchObject(expected);
        });
    });

    describe("refreshExpirationToken", () => {
        beforeEach(async () => {
            await service.createUser("test@beta.gouv.fr");
        });

        it("should update user (called with user)", async () => {
            const user = (await service.findByEmail("test@beta.gouv.fr")) as UserDto;
            const mock = jest.spyOn(userRepository, "update");
            await service.refreshExpirationToken(user);

            expect(mock).toHaveBeenCalled();
        });
    });

    describe("resetPassword", () => {
        let userId: ObjectId;
        beforeEach(async () => {
            const user = await service.createUser("test@beta.gouv.fr");
            userId = user._id;
            await userResetRepository.create(new UserReset(userId, "token", new Date()));
        });

        it("should reject because resetToken not found", async () => {
            await expect(service.resetPassword("", "FAKE_TOKEN")).rejects.toMatchObject({
                message: "Reset token not found",
                code: ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND
            });
        });

        it("should reject because resetToken has expired", async () => {
            await userResetRepository.removeAllByUserId(userId);
            await userResetRepository.create(
                new UserReset(userId, "token", new Date(Date.now() - 1000 * 60 * 60 * 24 * 11))
            );

            await expect(() => service.resetPassword("", "token")).rejects.toMatchObject({
                message: "Reset token has expired, please retry forget password",
                code: ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED
            });
        });

        it("should reject because user not found", async () => {
            await userResetRepository.removeAllByUserId(userId);
            await userResetRepository.create(new UserReset(new ObjectId(), "token", new Date()));

            await expect(() => service.resetPassword("", "token")).rejects.toMatchObject({
                message: "User not found",
                code: ResetPasswordErrorCodes.USER_NOT_FOUND
            });
        });

        it("should reject because password not valid", async () => {
            await expect(() => service.resetPassword("", "token")).rejects.toMatchObject({
                message: dedent`Password is too weak, please use this rules:
                    At least one digit [0-9]
                    At least one lowercase character [a-z]
                    At least one uppercase character [A-Z]
                    At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]
                    At least 8 characters in length, but no more than 32.`,
                code: ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID
            });
        });

        it("should change password", async () => {
            await expect(service.resetPassword("newPass;word789", "token")).resolves.toMatchObject({
                email: "test@beta.gouv.fr",
                active: true
            });
        });

        it("should remove resetUser", async () => {
            const mock = jest.spyOn(userResetRepository, "remove");
            await service.resetPassword("newPass;word789", "token");
            expect(mock).toHaveBeenCalledWith(expect.objectContaining({ userId: expect.any(ObjectId) }));
        });
    });

    describe("forgetPassword", () => {
        let userId: ObjectId;
        beforeEach(async () => {
            const user = await service.createUser("test@beta.gouv.fr");
            userId = user._id;
        });

        it("should reject because user email not found", async () => {
            await expect(service.forgetPassword("wrong@email.fr")).rejects.toMatchObject({
                message: "User not found",
                code: UserServiceErrors.USER_NOT_FOUND
            });
        });

        it("should update user (called with user)", async () => {
            await expect(service.forgetPassword("test@beta.gouv.fr")).resolves.toMatchObject({ userId: userId });
        });
    });

    describe("resetUser", () => {
        let user: UserDto;
        beforeEach(() => (user = service.createUser("test@beta.gouv.fr")));

        it("should create a reset user", async () => {
            const mockRemoveAll = jest.spyOn(userResetRepository, "removeAllByUserId");
            const mockCreate = jest.spyOn(userResetRepository, "create");
            const mockUpdate = jest.spyOn(userRepository, "update");

            await expect(service.resetUser(user)).resolves.toMatchObject({ userId: user._id });
            expect(mockRemoveAll).toHaveBeenCalledWith(user._id);
            expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ userId: user._id }));
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ active: false }));
        });
    });

    describe("findJwtByEmail", () => {
        beforeEach(async () => {
            await service.createUser("test@beta.gouv.fr");
        });

        it("should reject because user not found", async () => {
            const expected = {
                success: false,
                message: "User not found",
                code: UserServiceErrors.USER_NOT_FOUND
            };
            let actual;
            try {
                actual = await service.findJwtByEmail("wrong@email.fr");
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });

        it("should return jwt", async () => {
            const expected = {
                success: true,
                jwt: {
                    token: expect.stringContaining(""),
                    expirateDate: expect.any(Date)
                }
            };
            const actual = await service.findJwtByEmail("test@beta.gouv.fr");
            expect(actual).toEqual(expected);
        });
    });

    describe("passwordValidator", () => {
        it("should reject because no number in password", () => {
            expect(service.passwordValidator("AAAAAAAaaaaaa;;;;")).toBe(false);
        });

        it("should reject because no char (Uppercase) in password", () => {
            expect(service.passwordValidator("11111aaaaaa;;;;")).toBe(false);
        });

        it("should reject because no char (Lowercase) in password", () => {
            expect(service.passwordValidator("11111AAAAA;;;;")).toBe(false);
        });

        it("should reject because no special char in password", () => {
            expect(service.passwordValidator("11111AAAAAaaaaaa")).toBe(false);
        });

        it("should reject because length is to short in password", () => {
            expect(service.passwordValidator("Aa1;")).toBe(false);
        });

        it("should reject because length is to big in password", () => {
            expect(
                service.passwordValidator(
                    "Aa1;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                )
            ).toBe(false);
        });

        it("should accept", () => {
            expect(service.passwordValidator("SUPER;test::12345678")).toBe(true);
        });
    });
});

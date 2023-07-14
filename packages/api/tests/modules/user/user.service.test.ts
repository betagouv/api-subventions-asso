//TODO: transform this in unit test (src/modules/user/user.service.test.ts) or move it to user.spec.ts

import UserDto from "@api-subventions-asso/dto/user/UserDto";
import { ObjectId } from "mongodb";
import { RoleEnum } from "../../../src/@enums/Roles";
import userResetRepository from "../../../src/modules/user/repositories/user-reset.repository";
import userRepository from "../../../src/modules/user/repositories/user.repository";
import { UserService, UserServiceErrors } from "../../../src/modules/user/user.service";
import { BadRequestError, NotFoundError } from "../../../src/shared/errors/httpErrors";
import notifyService from "../../../src/modules/notify/notify.service";

describe("user.service.ts", () => {
    const notifyMock = jest.spyOn(notifyService, "notify").mockImplementation(jest.fn());
    const findByEmailMock = jest.spyOn(userRepository, "findByEmail");
    let service;

    beforeEach(async () => {
        service = new UserService();
    });

    afterAll(() => {
        notifyMock.mockRestore();
    });

    describe("findByEmail", () => {
        beforeEach(async () => {
            await service.createUser({ email: "test@beta.gouv.fr" });
        });

        it("should return user", async () => {
            await expect(service.findByEmail("test@beta.gouv.fr")).resolves.toMatchObject({
                email: "test@beta.gouv.fr",
            });
        });
        it("should return null", async () => {
            await expect(service.findByEmail("testAA@beta.gouv.fr")).resolves.toBe(null);
        });
    });

    describe("createUser", () => {
        it("should reject because email is not valid", async () => {
            await expect(service.createUser({ email: "test[at]beta.gouv.fr" })).rejects.toMatchObject({
                message: "Email is not valid",
                code: UserServiceErrors.CREATE_INVALID_EMAIL,
            });
        });
        it("should reject because user already exists", async () => {
            await service.createUser({ email: "test@beta.gouv.fr" });
            const test = async () => await service.createUser({ email: "test@beta.gouv.fr" });
            await expect(test).rejects.toMatchObject({
                message: "User already exists",
                code: UserServiceErrors.CREATE_USER_ALREADY_EXISTS,
            });
        });

        it("should return created user", async () => {
            await expect(service.createUser({ email: "test@beta.gouv.fr" })).resolves.toMatchObject({
                email: "test@beta.gouv.fr",
                active: false,
                roles: ["user"],
            });
        });
    });

    describe("addRolesToUser", () => {
        const EMAIL = "test@beta.gouv.fr";
        beforeEach(async () => {
            await service.createUser({ email: EMAIL });
        });

        it("should throw NotFoundError if user email not found", async () => {
            const expected = new NotFoundError("User Not Found");
            let actual;
            try {
                actual = await service.addRolesToUser("wrong@email.fr", [RoleEnum.admin]);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });

        it("should throw BadRequestError if role not found", async () => {
            const ROLE = "adm";
            const expected = new BadRequestError(`Role ${ROLE} is not valid`);
            const test = async () => await service.addRolesToUser(EMAIL, [ROLE]);
            expect(test).rejects.toThrowError(expected);
        });

        it("should update user (called with email)", async () => {
            await expect(service.addRolesToUser("test@beta.gouv.fr", [RoleEnum.admin])).resolves.toMatchObject({
                user: { roles: ["user", "admin"] },
            });
        });

        it("should update user (called with user)", async () => {
            const user = (await service.findByEmail("test@beta.gouv.fr")) as UserDto;
            await expect(service.addRolesToUser(user, [RoleEnum.admin])).resolves.toMatchObject({
                user: { roles: ["user", "admin"] },
            });
        });
    });

    describe("activeUser", () => {
        beforeEach(async () => {
            await service.createUser({ email: "test@beta.gouv.fr" });
        });

        it("should reject because user email not found", async () => {
            const expected = new NotFoundError("User email does not correspond to a user");
            expect(() => service.activeUser("wrong@email.fr")).rejects.toThrowError(expected);
        });

        it("should update user (called with email)", async () => {
            const expected = {
                user: { active: true },
            };
            const actual = await service.activeUser("test@beta.gouv.fr");
            expect(actual).toMatchObject(expected);
        });

        it("should update user (called with user)", async () => {
            const expected = { user: { active: true } };
            const user = (await service.findByEmail("test@beta.gouv.fr")) as UserDto;
            const actual = await service.activeUser(user);
            expect(actual).toMatchObject(expected);
        });
    });

    describe("refreshExpirationToken", () => {
        beforeEach(async () => {
            await service.createUser({ email: "test@beta.gouv.fr" });
        });

        it("should update user (called with user)", async () => {
            const user = (await service.findByEmail("test@beta.gouv.fr")) as UserDto;
            const mock = jest.spyOn(userRepository, "update");
            await service.refreshExpirationToken(user);

            expect(mock).toHaveBeenCalled();
        });
    });

    describe("forgetPassword", () => {
        let userId: ObjectId;
        beforeEach(async () => {
            const user = await service.createUser({ email: "test@beta.gouv.fr" });
            userId = user._id;
        });

        it("should check if user exist", async () => {
            await service.forgetPassword("wrong@email.fr");
            await expect(findByEmailMock).toHaveBeenCalledWith("wrong@email.fr");
        });

        it("should send a notification", async () => {
            await service.forgetPassword("test@beta.gouv.fr");
            await expect(notifyMock).toHaveBeenCalled();
        });
    });

    describe("resetUser", () => {
        let user: UserDto;
        beforeEach(() => (user = service.createUser({ email: "test@beta.gouv.fr" })));

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
                    "Aa1;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                ),
            ).toBe(false);
        });

        it("should accept", () => {
            expect(service.passwordValidator("SUPER;test::12345678")).toBe(true);
        });
    });
});

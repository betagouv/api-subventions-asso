//TODO: transform this in unit test (src/modules/user/user.service.test.ts) or move it to user.spec.ts

import { UserDto } from "dto";
import { ObjectId } from "mongodb";
import { RoleEnum } from "../../../src/@enums/Roles";
import userResetRepository from "../../../src/modules/user/repositories/user-reset.repository";
import userRepository from "../../../src/modules/user/repositories/user.repository";
import { UserService, UserServiceErrors } from "../../../src/modules/user/user.service";
import { BadRequestError, InternalServerError, NotFoundError } from "../../../src/shared/errors/httpErrors";
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
                message: "An error has occurred",
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
});

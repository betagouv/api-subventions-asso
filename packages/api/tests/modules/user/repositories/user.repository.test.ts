//TODO: transform this to unit test or integ test in user.spec

import { UserDto } from "dto";
import { ObjectId } from "mongodb";
import userRepository from "../../../../src/modules/user/repositories/user.repository";
import userService from "../../../../src/modules/user/user.service";
import { UserNotPersisted } from "../../../../src/modules/user/repositories/dbo/UserDbo";

describe("UserRepository", () => {
    const defaultUser = {
        email: "test22@beta.gouv.fr",
        hashPassword: "PASSWORD",
        roles: ["user"],
        signupAt: new Date(),
        jwt: { token: "TOKEN", expirateDate: new Date() },
        active: false,
        stats: { searchCount: 0, lastSearchDate: null },
        profileToComplete: false,
    };
    describe("The methods must not return any secret", () => {
        beforeEach(async () => {
            await userService.createUser({ email: "test@beta.gouv.fr" });
        });

        it("findByEmail", async () => {
            await expect(userRepository.findByEmail("test@beta.gouv.fr")).resolves.toMatchObject(
                expect.not.objectContaining({
                    hashPassword: expect.any(String),
                    jwt: { token: expect.any(String), expirateDate: expect.any(Date) },
                }),
            );
        });

        it("update", async () => {
            const user = (await userRepository.findByEmail("test@beta.gouv.fr")) as UserDto;
            await expect(userRepository.update({ ...user, active: true })).resolves.toMatchObject(
                expect.not.objectContaining({
                    hashPassword: expect.any(String),
                    jwt: { token: expect.any(String), expirateDate: expect.any(Date) },
                }),
            );
        });

        it("create", async () => {
            await expect(userRepository.create(defaultUser as UserNotPersisted)).resolves.toMatchObject(
                expect.not.objectContaining({
                    hashPassword: expect.any(String),
                    jwt: { token: expect.any(String), expirateDate: expect.any(Date) },
                }),
            );
        });
    });

    describe("getUserWithSecretsByEmail", () => {
        beforeEach(async () => {
            await userService.createUser({ email: "test@beta.gouv.fr" });
        });

        it("should return user", async () => {
            const actual = await userRepository.getUserWithSecretsByEmail("test@beta.gouv.fr");
            expect(actual).toMatchSnapshot({
                _id: expect.any(ObjectId),
                signupAt: expect.any(Date),
                hashPassword: expect.any(String),
                jwt: { expirateDate: expect.any(Date), token: expect.any(String) },
            });
        });

        it("should return null", async () => {
            await expect(userRepository.getUserWithSecretsByEmail("")).resolves.toBe(null);
        });
    });
});

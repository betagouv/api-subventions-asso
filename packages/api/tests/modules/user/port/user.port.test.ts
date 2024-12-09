//TODO: transform this to unit test or integ test in user.spec

import { UserDto } from "dto";
import { ObjectId } from "mongodb";
import userPort from "../../../../src/dataProviders/db/user/user.port";
import userCrudService from "../../../../src/modules/user/services/crud/user.crud.service";

describe("UserPort", () => {
    const defaultUser = {
        email: "test22@beta.gouv.fr",
        hashPassword: "PASSWORD",
        roles: ["user"],
        signupAt: new Date(),
        jwt: { token: "TOKEN", expirateDate: new Date() },
        active: false,
        lastActivityDate: null,
        nbVisits: 0,
        profileToComplete: false,
    }; // TODO fix here
    describe("The methods must not return any secret", () => {
        beforeEach(async () => {
            await userCrudService.createUser({ email: "test@beta.gouv.fr" });
        });

        it("findByEmail", async () => {
            await expect(userPort.findByEmail("test@beta.gouv.fr")).resolves.toMatchObject(
                expect.not.objectContaining({
                    hashPassword: expect.any(String),
                    jwt: { token: expect.any(String), expirateDate: expect.any(Date) },
                }),
            );
        });

        it("update", async () => {
            const user = (await userPort.findByEmail("test@beta.gouv.fr")) as UserDto;
            await expect(userPort.update({ ...user, active: true })).resolves.toMatchObject(
                expect.not.objectContaining({
                    hashPassword: expect.any(String),
                    jwt: { token: expect.any(String), expirateDate: expect.any(Date) },
                }),
            );
        });

        it("create", async () => {
            // @ts-expect-error: light user
            await expect(userPort.create(defaultUser)).resolves.toMatchObject(
                expect.not.objectContaining({
                    hashPassword: expect.any(String),
                    jwt: { token: expect.any(String), expirateDate: expect.any(Date) },
                }),
            );
        });
    });

    describe("getUserWithSecretsByEmail", () => {
        beforeEach(async () => {
            await userCrudService.createUser({ email: "test@beta.gouv.fr" });
        });

        it("should return user", async () => {
            const actual = await userPort.getUserWithSecretsByEmail("test@beta.gouv.fr");
            expect(actual).toMatchSnapshot({
                _id: expect.any(ObjectId),
                signupAt: expect.any(Date),
                jwt: { expirateDate: expect.any(Date), token: expect.any(String) },
            });
        });

        it("should return null", async () => {
            await expect(userPort.getUserWithSecretsByEmail("")).resolves.toBe(null);
        });
    });
});

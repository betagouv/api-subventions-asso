import { ObjectId } from "mongodb";
import User, { UserWithoutSecret } from "../../../../src/modules/user/entities/User";
import userRepository from "../../../../src/modules/user/repositories/user.repository";
import userService from "../../../../src/modules/user/user.service"

describe("UserRepository", () => {

    const defaultUser = {
        email: "test22@beta.gouv.fr",
        hashPassword: "PASSWORD",
        roles: ["user"],
        signupAt: new Date(),
        jwt: { token: "TOKEN", expirateDate: new Date() },
        active: false,
        stats: { searchCount: 0, lastSearchDate: null }
    };
    describe('The methods must not return any secret', () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr");
        });

        it("findByEmail", async () => {
            await expect(userRepository.findByEmail("test@beta.gouv.fr"))
                .resolves
                .toMatchObject(
                    expect.not.objectContaining({ hashPassword: expect.any(String), jwt: { token: expect.any(String), expirateDate: expect.any(Date) } })
                )
        });

        it("update", async () => {
            const user = await userRepository.findByEmail("test@beta.gouv.fr") as UserWithoutSecret;
            await expect(userRepository.update({ ...user, active: true }))
                .resolves
                .toMatchObject(
                    expect.not.objectContaining({ hashPassword: expect.any(String), jwt: { token: expect.any(String), expirateDate: expect.any(Date) } })
                )
        });

        it("create", async () => {
            await expect(userRepository.create(new User(defaultUser)))
                .resolves
                .toMatchObject(
                    expect.not.objectContaining({ hashPassword: expect.any(String), jwt: { token: expect.any(String), expirateDate: expect.any(Date) } })
                )
        });
    });

    describe('removeSecrets', () => {
        it("should remove all secret in user", () => {
            const user = new User(defaultUser);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userRepository.removeSecrets(user)).not.toHaveProperty("jwt")

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userRepository.removeSecrets(user)).not.toHaveProperty("hashPassword")
        })
    });

    describe("findPassword", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr");
        });

        it("should return password", async () => {
            const user = await userRepository.findByEmail("test@beta.gouv.fr") as UserWithoutSecret;

            await expect(typeof await userRepository.findPassword(user)).toBe("string");
        })

        it("should return null", async () => {
            const user = new User(defaultUser);

            await expect(userRepository.findPassword(user as UserWithoutSecret)).resolves.toBe(null);
        })
    })

    describe("findJwt", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr");
        });

        it("should return jwt", async () => {
            const user = await userRepository.findByEmail("test@beta.gouv.fr") as UserWithoutSecret;

            await expect(userRepository.findJwt(user)).resolves.toMatchObject({ token: expect.any(String), expirateDate: expect.any(Date) });
        })

        it("should return null", async () => {
            const user = new User(defaultUser, new ObjectId());

            await expect(userRepository.findJwt(user as UserWithoutSecret)).resolves.toBe(null);
        })
    })
})
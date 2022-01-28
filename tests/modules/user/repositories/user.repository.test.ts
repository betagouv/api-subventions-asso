import User, { UserWithoutSecret } from "../../../../src/modules/user/entities/User";
import userRepository from "../../../../src/modules/user/repositoies/user.repository";
import userService from "../../../../src/modules/user/user.service"

describe("UserRepository", () => {
    describe('The methods must not return any secret', () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr");
        });

        it("findByEmail", async () => {
            await expect(userRepository.findByEmail("test@beta.gouv.fr"))
                .resolves
                .toMatchObject(
                    expect.not.objectContaining({ hashPassword: expect.any(String), jwt: { token: expect.any(String), expirateDate: expect.any(Date)}})
                )
        });

        it("update", async () => {
            const user = await userRepository.findByEmail("test@beta.gouv.fr") as UserWithoutSecret;
            await expect(userRepository.update({...user, active: true}))
                .resolves
                .toMatchObject(
                    expect.not.objectContaining({ hashPassword: expect.any(String), jwt: { token: expect.any(String), expirateDate: expect.any(Date)}})
                )
        });

        it("create", async () => {
            await expect(userRepository.create(new User("test2@beta.gouv.fr", "", ["user"], { token: "", expirateDate: new Date()}, false)))
                .resolves
                .toMatchObject(
                    expect.not.objectContaining({ hashPassword: expect.any(String), jwt: { token: expect.any(String), expirateDate: expect.any(Date)}})
                )
        });
    });

    describe('removeSecrets', () => {
        it("should remove all secret in user", () => {
            const user = new User("test@beta.gouv.fr", "PASSWORD", ["user"], { token: "TOKEN", expirateDate: new Date()}, false);

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

            await expect( typeof await userRepository.findPassword(user)).toBe("string");
        })

        it("should return null", async () => {
            const user = new User("test22@beta.gouv.fr", "PASSWORD", ["user"], { token: "TOKEN", expirateDate: new Date()}, false);

            await expect(userRepository.findPassword(user)).resolves.toBe(null);
        })
    })

    describe("findJwt", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr");
        });

        it("should return jwt", async () => {
            const user = await userRepository.findByEmail("test@beta.gouv.fr") as UserWithoutSecret;

            await expect(userRepository.findJwt(user)).resolves.toMatchObject({token: expect.any(String), expirateDate: expect.any(Date)});
        })

        it("should return null", async () => {
            const user = new User("test22@beta.gouv.fr", "PASSWORD", ["user"], { token: "TOKEN", expirateDate: new Date()}, false);

            await expect(userRepository.findJwt(user)).resolves.toBe(null);
        })
    })
})
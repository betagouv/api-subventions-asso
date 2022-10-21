import UserDto from "@api-subventions-asso/dto/user/UserDto";
import { ObjectId } from "mongodb";
import UserNotPersisted from "../../../../src/modules/user/entities/UserNotPersisted";
import userRepository from "../../../../src/modules/user/repositoies/user.repository";
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
            const user = await userRepository.findByEmail("test@beta.gouv.fr") as UserDto;
            await expect(userRepository.update({ ...user, active: true }))
                .resolves
                .toMatchObject(
                    expect.not.objectContaining({ hashPassword: expect.any(String), jwt: { token: expect.any(String), expirateDate: expect.any(Date) } })
                )
        });

        it("create", async () => {
            await expect(userRepository.create(new UserNotPersisted(defaultUser)))
                .resolves
                .toMatchObject(
                    expect.not.objectContaining({ hashPassword: expect.any(String), jwt: { token: expect.any(String), expirateDate: expect.any(Date) } })
                )
        });
    });

    describe('removeSecrets', () => {
        it("should remove all secret in user", () => {
            const user = new UserNotPersisted(defaultUser);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userRepository.removeSecrets(user)).not.toHaveProperty("jwt")

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userRepository.removeSecrets(user)).not.toHaveProperty("hashPassword")
        })
    });

    describe("getUserWithSecretsByEmail", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr");
        });

        it("should return user", async () => {
            const actual = await userRepository.getUserWithSecretsByEmail("test@beta.gouv.fr");
            expect(actual).toMatchSnapshot({ _id: expect.any(ObjectId), signupAt: expect.any(Date), hashPassword: expect.any(String), jwt: { expirateDate: expect.any(Date), token: expect.any(String) } });
        })

        it("should return null", async () => {
            await expect(userRepository.getUserWithSecretsByEmail("")).resolves.toBe(null);
        })
    })
})
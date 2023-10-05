import bcrypt from "bcrypt";
jest.mock("bcrypt");
jest.mock("../../shared/helpers/StringHelper");
jest.mock("../../configurations/jwt.conf", () => ({
    JWT_EXPIRES_TIME: 123456789,
    JWT_SECRET: "secret",
}));
import userRepository from "./repositories/user.repository";
jest.mock("./repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository, true);
import userAuthService from "./services/auth/user.auth.service";
jest.mock("./services/auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService, true);
import * as repositoryHelper from "../../shared/helpers/RepositoryHelper";
jest.mock("../../shared/helpers/RepositoryHelper", () => ({
    removeSecrets: jest.fn(user => user),
    uniformizeId: jest.fn(token => token),
}));

import userService from "./user.service";
import { USER_DBO } from "./__fixtures__/user.fixture";
jest.mock("./services/crud/user.crud.service");

jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

describe("User Service", () => {
    beforeAll(() => mockedUserRepository.getUserWithSecretsByEmail.mockImplementation(async () => USER_DBO));

    beforeEach(() => {
        jest.mocked(bcrypt.compare).mockImplementation(async () => true);
        mockedUserAuthService.buildJWTToken.mockImplementation(() => "SIGNED_TOKEN");
    });

    describe("getUserWithoutSecret", () => {
        const EMAIL = "user@mail.fr";

        it("gets user from repo", async () => {
            jest.mocked(userRepository.getUserWithSecretsByEmail).mockResolvedValueOnce(USER_DBO);
            await userService.getUserWithoutSecret(EMAIL);
            expect(userRepository.getUserWithSecretsByEmail).toHaveBeenCalledWith(EMAIL);
        });

        it("should call removeSecrets()", async () => {
            jest.mocked(userRepository.getUserWithSecretsByEmail).mockResolvedValueOnce(USER_DBO);
            const actual = await userService.getUserWithoutSecret(EMAIL);
            expect(repositoryHelper.removeSecrets).toHaveBeenCalledTimes(1);
        });

        it("throws not found if noe found", async () => {
            jest.mocked(userRepository.getUserWithSecretsByEmail).mockResolvedValueOnce(null);
            const test = () => userService.getUserWithoutSecret(EMAIL);
            await expect(test).rejects.toMatchInlineSnapshot(`[Error: User not found]`);
        });
    });
});

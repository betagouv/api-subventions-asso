import { BadRequestError, InternalServerError, NotFoundError } from "../../shared/errors/httpErrors";
import bcrypt from "bcrypt";
jest.mock("bcrypt");
import { sanitizeToPlainText } from "../../shared/helpers/StringHelper";
jest.mock("../../shared/helpers/StringHelper");
jest.mock("../../configurations/jwt.conf", () => ({
    JWT_EXPIRES_TIME: 123456789,
    JWT_SECRET: "secret",
}));
import consumerTokenRepository from "./repositories/consumer-token.repository";
jest.mock("./repositories/consumer-token.repository");
const mockConsumerTokenRepository = jest.mocked(consumerTokenRepository, true);
import userRepository from "./repositories/user.repository";
jest.mock("./repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository, true);
import userResetRepository from "./repositories/user-reset.repository";
jest.mock("./repositories/user-reset.repository");
const mockedUserResetRepository = jest.mocked(userResetRepository, true);
import notifyService from "../notify/notify.service";
// I think that because notify is a getter we have to explicitly define notify as a function here
jest.mock("../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService, true);
import userCheckService from "./services/check/user.check.service";
jest.mock("./services/check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userAuthService from "./services/auth/user.auth.service";
jest.mock("./services/auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService, true);
import userProfileService from "./services/profile/user.profile.service";
jest.mock("./services/profile/user.profile.service");
const mockedUserProfileService = jest.mocked(userProfileService);
import userActivationService from "./services/activation/user.activation.service";
jest.mock("./services/activation/user.activation.service");
const mockedUserActivationService = jest.mocked(userActivationService);
import * as repositoryHelper from "../../shared/helpers/RepositoryHelper";
jest.mock("../../shared/helpers/RepositoryHelper", () => ({
    removeSecrets: jest.fn(user => user),
    uniformizeId: jest.fn(token => token),
}));

import mocked = jest.mocked;
import userService, { UserServiceErrors } from "./user.service";
import { RoleEnum } from "../../@enums/Roles";
import { UserDto } from "dto";
import UserReset from "./entities/UserReset";
import { USER_EMAIL } from "../../../tests/__helpers__/userHelper";
import { NotificationType } from "../notify/@types/NotificationType";
import { CONSUMER_USER, SIGNED_TOKEN, USER_DBO, USER_WITHOUT_SECRET } from "./__fixtures__/user.fixture";

jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

const CONSUMER_JWT_PAYLOAD = {
    ...USER_WITHOUT_SECRET,
    isConsumerToken: true,
};

describe("User Service", () => {
    /**
     *          MOCK USER SERVICE METHODS
     */

    const mockCreateUser = jest.spyOn(userService, "createUser");
    const mockCreateConsumer = jest.spyOn(userService, "createConsumer");
    const mockDeleteUser = jest.spyOn(userService, "delete");
    const mockResetUser = jest.spyOn(userService, "resetUser");
    const mockGetUserById = jest.spyOn(userService, "getUserById");

    beforeAll(() => mockedUserRepository.getUserWithSecretsByEmail.mockImplementation(async () => USER_DBO));

    beforeEach(() => {
        jest.mocked(bcrypt.compare).mockImplementation(async () => true);
        mockedUserAuthService.buildJWTToken.mockImplementation(() => "SIGNED_TOKEN");
    });

    describe("signup", () => {
        const mockList = [mockCreateUser];
        afterAll(() => mockList.forEach(mock => mock.mockReset()));

        it("should create a consumer", async () => {
            mockResetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateConsumer.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup({ email: USER_EMAIL }, RoleEnum.consumer);
            expect(mockCreateConsumer).toHaveBeenCalled();
        });

        it("should create a user", async () => {});

        it("should create a reset token", async () => {
            mockResetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateUser.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup({ email: USER_EMAIL });
            expect(mockResetUser).toHaveBeenCalled();
        });

        it("should notify USER_CREATED", async () => {
            mockResetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateUser.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup({ email: USER_EMAIL });
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(
                NotificationType.USER_CREATED,
                expect.objectContaining({ email: USER_EMAIL }),
            );
        });

        it("should return a user", async () => {
            const expected = { email: USER_EMAIL };
            mockResetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateUser.mockImplementationOnce(async () => expected as UserDto);
            const actual = await userService.signup({ email: USER_EMAIL });
            expect(actual).toEqual(expected);
        });
    });

    describe("delete", () => {
        beforeAll(() => {
            mockGetUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserRepository.delete.mockResolvedValue(true);
            mocked(mockedUserResetRepository.removeAllByUserId).mockResolvedValue(true);
            mocked(consumerTokenRepository.deleteAllByUserId).mockResolvedValue(true);
        });

        afterAll(() => {
            mockGetUserById.mockReset();
            mockedUserRepository.delete.mockReset();
            mocked(mockedUserResetRepository.removeAllByUserId).mockReset();
            mocked(consumerTokenRepository.deleteAllByUserId).mockReset();
        });

        it("gets user", async () => {
            await userService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(mockGetUserById).toHaveBeenCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("returns false if no user without calling other repos", async () => {
            mockGetUserById.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await userService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
            expect(mockedUserRepository.delete).not.toHaveBeenCalled();
            expect(mockedUserResetRepository.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenRepository.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                         | methodName                                       | arg
            ${mockedUserRepository.delete}                 | ${"mockedUserRepository.delete"}                 | ${USER_WITHOUT_SECRET}
            ${mockedUserResetRepository.removeAllByUserId} | ${"mockedUserResetRepository.removeAllByUserId"} | ${USER_WITHOUT_SECRET._id}
            ${consumerTokenRepository.deleteAllByUserId}   | ${"consumerTokenRepository.deleteAllByUserId"}   | ${USER_WITHOUT_SECRET._id}
        `("calls $methodName", async ({ arg, method }) => {
            await userService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(method).toHaveBeenCalledWith(arg);
        });

        it("returns false without other calls if mockedUserRepository.delete returns false", async () => {
            mockedUserRepository.delete.mockResolvedValueOnce(false);

            const expected = false;
            const actual = await userService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);

            expect(mockedUserResetRepository.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenRepository.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                         | methodName
            ${mockedUserResetRepository.removeAllByUserId} | ${"mockedUserResetRepository.removeAllByUserId"}
            ${consumerTokenRepository.deleteAllByUserId}   | ${"consumerTokenRepository.deleteAllByUserId"}
        `("returns false if $methodName returns false", async ({ method }) => {
            mocked(method).mockResolvedValueOnce(false);
            const expected = false;
            const actual = await userService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
        });

        it("returns true in case of success", async () => {
            const expected = true;
            const actual = await userService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
        });

        it("should notify USER_DELETED", async () => {
            await userService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_DELETED, {
                email: USER_WITHOUT_SECRET.email,
                firstname: USER_WITHOUT_SECRET.firstName,
                lastname: USER_WITHOUT_SECRET.lastName,
            });
        });
    });

    describe("createConsumer", () => {
        beforeAll(() => {
            mockDeleteUser.mockImplementation(jest.fn());
            mockCreateUser.mockImplementation(async () => CONSUMER_USER);
        });

        afterAll(() => {
            mockDeleteUser.mockReset();
            mockCreateUser.mockReset();
        });

        it("should call createUser()", async () => {
            await userService.createConsumer({ email: USER_EMAIL });
            expect(mockCreateUser).toBeCalledTimes(1);
        });

        it("should not create consumer token if user creation failed", async () => {
            mockCreateUser.mockRejectedValueOnce(new Error());
            await userService.createConsumer({ email: USER_EMAIL }).catch(() => {});
            expect(mockCreateUser).toBeCalledTimes(1);
        });

        it("should create a token ", async () => {
            const expected = CONSUMER_JWT_PAYLOAD;
            mockCreateUser.mockImplementationOnce(async () => USER_WITHOUT_SECRET);
            await userService.createConsumer({ email: USER_EMAIL });
            expect(mockedUserAuthService.buildJWTToken).toHaveBeenCalledWith(expected, {
                expiration: false,
            });
        });

        it("should call consumerTokenRepository.create", async () => {
            await userService.createConsumer({ email: USER_EMAIL });
            expect(mockConsumerTokenRepository.create).toBeCalledTimes(1);
        });

        it("should delete user if token generation failed", async () => {
            mockConsumerTokenRepository.create.mockRejectedValueOnce(new Error());
            const id = USER_WITHOUT_SECRET._id.toString();
            await userService.createConsumer({ email: USER_EMAIL }).catch(() => {});
            expect(mockDeleteUser).toHaveBeenCalledWith(id);
        });

        it("should throw if token generation failed", async () => {
            mockConsumerTokenRepository.create.mockRejectedValueOnce(new Error());
            const test = () => userService.createConsumer({ email: USER_EMAIL });
            await expect(test).rejects.toMatchObject(
                new InternalServerError("Could not create consumer token", UserServiceErrors.CREATE_CONSUMER_TOKEN),
            );
        });

        it("should return UserDtoSuccessResponse", async () => {
            const expected = CONSUMER_USER;
            mockConsumerTokenRepository.create.mockImplementationOnce(async () => true);
            const actual = await userService.createConsumer({ email: USER_EMAIL });
            expect(actual).toEqual(expected);
        });
    });

    describe("createUser", () => {
        const FUTURE_USER = {
            firstName: "Jocelyne",
            lastName: "Dupontel",
            email: USER_EMAIL,
            roles: [RoleEnum.user],
        };

        beforeAll(() => {
            mockCreateUser.mockRestore();
            jest.mocked(mockedUserRepository.create).mockResolvedValue(USER_WITHOUT_SECRET);
            // @ts-expect-error - mock
            jest.mocked(bcrypt.hash).mockResolvedValue("hashedPassword");
            mockedUserCheckService.validateSanitizeUser.mockImplementation(async user => user);
            mockedUserAuthService.buildJWTToken.mockReturnValue(SIGNED_TOKEN);
        });

        afterAll(() => {
            jest.mocked(mockedUserRepository.findByEmail).mockReset();
            mockedUserCheckService.validateSanitizeUser.mockReset();
            jest.mocked(bcrypt.hash).mockReset();
        });

        it("sets default role", async () => {
            await userService.createUser({ email: USER_EMAIL });
            expect(mockedUserCheckService.validateSanitizeUser).toHaveBeenCalledWith({
                email: USER_EMAIL,
                roles: [RoleEnum.user],
            });
        });

        it("validates user object", async () => {
            await userService.createUser(FUTURE_USER);
            expect(mockedUserCheckService.validateSanitizeUser).toHaveBeenCalledWith(FUTURE_USER);
        });

        it("calls userRepository.create()", async () => {
            mockedUserCheckService.validateSanitizeUser.mockImplementation(async user => user);
            await userService.createUser({ ...FUTURE_USER });
            expect(mockedUserRepository.create).toHaveBeenCalledTimes(1);
        });

        it("ignores properties that should not be saved", async () => {
            // @ts-expect-error testing purposes
            await userService.createUser({ ...FUTURE_USER, randomProperty: "lalala" });
            const expected = FUTURE_USER;
            const actual = jest.mocked(mockedUserRepository.create).mock.calls[0][0];
            expect(actual).toMatchObject(expected);
        });
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

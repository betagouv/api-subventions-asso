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

import userService, { UserServiceErrors } from "./user.service";
import { RoleEnum } from "../../@enums/Roles";
import { SignupErrorCodes, UserDto } from "dto";
import UserReset from "./entities/UserReset";
import { USER_EMAIL } from "../../../tests/__helpers__/userHelper";
import { NotificationType } from "../notify/@types/NotificationType";
import { CONSUMER_USER, SIGNED_TOKEN, USER_DBO, USER_WITHOUT_SECRET } from "./__fixtures__/user.fixture";
import userCrudService from "./services/crud/user.crud.service";
jest.mock("./services/crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);

jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

const CONSUMER_JWT_PAYLOAD = {
    ...USER_WITHOUT_SECRET,
    isConsumerToken: true,
};

describe("User Service", () => {
    const mockCreateConsumer = jest.spyOn(userService, "createConsumer");

    beforeAll(() => mockedUserRepository.getUserWithSecretsByEmail.mockImplementation(async () => USER_DBO));

    beforeEach(() => {
        jest.mocked(bcrypt.compare).mockImplementation(async () => true);
        mockedUserAuthService.buildJWTToken.mockImplementation(() => "SIGNED_TOKEN");
    });

    describe("signup", () => {
        const mockList = [mockedUserCrudService.createUser];
        afterAll(() => mockList.forEach(mock => mock.mockReset()));

        it("should create a consumer", async () => {
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateConsumer.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup({ email: USER_EMAIL }, RoleEnum.consumer);
            expect(mockCreateConsumer).toHaveBeenCalled();
        });

        it("should create a user", async () => {});

        it("should create a reset token", async () => {
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockedUserCrudService.createUser.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup({ email: USER_EMAIL });
            expect(mockedUserActivationService.resetUser).toHaveBeenCalled();
        });

        it("should notify USER_CREATED", async () => {
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockedUserCrudService.createUser.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup({ email: USER_EMAIL });
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(
                NotificationType.USER_CREATED,
                expect.objectContaining({ email: USER_EMAIL }),
            );
        });

        it("should return a user", async () => {
            const expected = { email: USER_EMAIL };
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockedUserCrudService.createUser.mockImplementationOnce(async () => expected as UserDto);
            const actual = await userService.signup({ email: USER_EMAIL });
            expect(actual).toEqual(expected);
        });

        it("should notify bad domain error", async () => {
            const error = mockCreateUser.mockRejectedValueOnce(
                new BadRequestError("mock", UserServiceErrors.CREATE_EMAIL_GOUV),
            );
            try {
                await userService.signup({ email: USER_EMAIL });
            } catch (_e) {
            } finally {
                expect(mockedNotifyService.notify).toHaveBeenCalledWith(
                    NotificationType.SIGNUP_BAD_DOMAIN,
                    expect.objectContaining({ email: USER_EMAIL }),
                );
            }
        });
    });

    describe("createConsumer", () => {
        beforeAll(() => {
            mockedUserCrudService.delete.mockImplementation(jest.fn());
            mockedUserCrudService.createUser.mockImplementation(async () => CONSUMER_USER);
        });

        afterAll(() => {
            mockedUserCrudService.delete.mockReset();
            mockedUserCrudService.createUser.mockReset();
        });

        it("should call createUser()", async () => {
            await userService.createConsumer({ email: USER_EMAIL });
            expect(mockedUserCrudService.createUser).toBeCalledTimes(1);
        });

        it("should not create consumer token if user creation failed", async () => {
            mockedUserCrudService.createUser.mockRejectedValueOnce(new Error());
            await userService.createConsumer({ email: USER_EMAIL }).catch(() => {});
            expect(mockedUserCrudService.createUser).toBeCalledTimes(1);
        });

        it("should create a token ", async () => {
            const expected = CONSUMER_JWT_PAYLOAD;
            mockedUserCrudService.createUser.mockImplementationOnce(async () => USER_WITHOUT_SECRET);
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
            expect(mockedUserCrudService.delete).toHaveBeenCalledWith(id);
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

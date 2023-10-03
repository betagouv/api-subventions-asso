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
import * as repositoryHelper from "../../shared/helpers/RepositoryHelper";
jest.mock("../../shared/helpers/RepositoryHelper", () => ({
    removeSecrets: jest.fn(user => user),
    uniformizeId: jest.fn(token => token),
}));

import mocked = jest.mocked;
import userService, { UserService, UserServiceErrors } from "./user.service";
import { ObjectId, WithId } from "mongodb";
import { RoleEnum } from "../../@enums/Roles";
import { SignupErrorCodes, UserDto } from "dto";
import UserReset from "./entities/UserReset";
import { ResetPasswordErrorCodes } from "dto";
import { USER_EMAIL } from "../../../tests/__helpers__/userHelper";
import statsService from "../stats/stats.service";
import { NotificationType } from "../notify/@types/NotificationType";
import { TokenValidationDtoPositiveResponse } from "dto";
import { TokenValidationType } from "dto";
import { AgentTypeEnum } from "dto";
import { AgentJobTypeEnum } from "dto";
import { CONSUMER_USER, SIGNED_TOKEN, USER_DBO, USER_SECRETS, USER_WITHOUT_SECRET } from "./__fixtures__/user.fixture";

jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

const UNACTIVATED_USER = { ...USER_WITHOUT_SECRET, ...{ active: false, profileToComplete: true } };

const USER_WITHOUT_PASSWORD = {
    ...USER_WITHOUT_SECRET,
    jwt: USER_SECRETS.jwt,
};

const CONSUMER_JWT_PAYLOAD = {
    ...USER_WITHOUT_SECRET,
    isConsumerToken: true,
};

const ANONYMIZED_USER = {
    ...USER_WITHOUT_SECRET,
    active: false,
    email: "",
    jwt: null,
    hashPassword: "",
    disable: true,
};

const USER_ACTIVATION_INFO = {
    password: "",
    agentType: AgentTypeEnum.CENTRAL_ADMIN,
    phoneNumber: "",
    service: "",
    jobType: [AgentJobTypeEnum.ADMINISTRATOR],
};

describe("User Service", () => {
    /**
     *          MOCK USER SERVICE METHODS
     */

    const mockCreateUser = jest.spyOn(userService, "createUser");
    const mockCreateConsumer = jest.spyOn(userService, "createConsumer");
    const mockDeleteUser = jest.spyOn(userService, "delete");
    const mockResetUser = jest.spyOn(userService, "resetUser");
    let mockSanitizeUserProfileData = jest.spyOn(userService, "sanitizeUserProfileData");
    // @ts-expect-error: mock private method
    const mockValidateResetToken: jest.SpyInstance<boolean> = jest.spyOn(userService, "validateResetToken");
    let mockValidateUserProfileDataUser: jest.SpyInstance<boolean> = jest.spyOn(
        userService,
        // @ts-expect-error: mock private method
        "validateUserProfileData",
    );
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

    describe("activate", () => {
        const RESET_DOCUMENT = {
            _id: new ObjectId(),
            userId: new ObjectId(),
            token: "qdqzd234234ffefsfsf!",
            createdAt: new Date(),
        };

        const mockList = [
            mockValidateUserProfileDataUser,
            mockSanitizeUserProfileData,
            mockedUserResetRepository.findByToken,
            mockValidateResetToken,
            mockedUserAuthService.updateJwt,
        ];
        beforeAll(() => {
            // @ts-expect-error: mock
            mockValidateUserProfileDataUser.mockImplementation(() => ({ valid: true }));
            // @ts-expect-error: mock
            mockValidateResetToken.mockImplementation(token => ({ valid: true }));
            mockSanitizeUserProfileData.mockImplementation(userInfo => userInfo);
            mockedUserAuthService.getHashPassword.mockImplementation(async password => Promise.resolve(password));
            mockedUserResetRepository.findByToken.mockImplementation(async token => RESET_DOCUMENT);
            // @ts-expect-error: unknown error
            mockedUserRepository.update.mockImplementation(() => ({
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
            }));
            mockGetUserById.mockImplementation(async id => UNACTIVATED_USER);
            mockedUserAuthService.updateJwt.mockImplementation(
                jest.fn(user => Promise.resolve({ ...user, jwt: USER_SECRETS.jwt })),
            );
        });
        afterAll(() => mockList.forEach(mock => mock.mockReset()));

        it("should call userRepository.update()", async () => {
            await userService.activate("token", USER_ACTIVATION_INFO);
            expect(userRepository.update).toHaveBeenCalledTimes(1);
        });

        it("should notify user updated", async () => {
            await userService.activate("token", USER_ACTIVATION_INFO);
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_UPDATED, {
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
                jwt: USER_SECRETS.jwt,
            });
        });

        it("should call validateUserProfileData()", async () => {
            const expected = USER_ACTIVATION_INFO;
            await userService.activate("token", USER_ACTIVATION_INFO);
            expect(mockValidateUserProfileDataUser).toHaveBeenCalledWith(expected);
        });

        it("should call validateAndSanitizeActivationUserInfo()", async () => {
            const expected = USER_ACTIVATION_INFO;
            await userService.activate("token", USER_ACTIVATION_INFO);
            expect(mockSanitizeUserProfileData).toHaveBeenCalledWith(expected);
        });

        it("update user's jwt", async () => {
            await userService.activate("token", USER_ACTIVATION_INFO);
            expect(mockedUserAuthService.updateJwt).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
            });
        });

        it("returns user with jwt", async () => {
            const expected = USER_ACTIVATION_INFO;
            const actual = await userService.activate("token", USER_ACTIVATION_INFO);
            expect(actual).toEqual({
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
                jwt: USER_SECRETS.jwt,
            });
        });
    });

    describe("validateUserProfileData()", () => {
        const validInput = {
            password: "m0t de Passe.",
            agentType: AgentTypeEnum.OPERATOR,
            jobType: [],
        };
        beforeAll(() => mockValidateUserProfileDataUser.mockRestore());
        afterAll(
            () =>
                (mockValidateUserProfileDataUser = jest
                    .spyOn(
                        userService,
                        // @ts-expect-error: mock private method
                        "validateUserProfileData",
                    )
                    // @ts-expect-error: mock signature
                    .mockImplementation(() => ({ valid: true }))),
        );

        describe("password", () => {
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementationOnce(() => false));
            it("should throw password is wrong", () => {
                // @ts-expect-error: private method
                const actual = userService.validateUserProfileData({
                    ...validInput,
                    password: "PA$$W0RD",
                });
                expect(actual).toMatchSnapshot();
            });

            it("does not check password if arg does not require it ", () => {
                const expected = { valid: true };
                // @ts-expect-error: private method
                const actual = userService.validateUserProfileData(
                    {
                        ...validInput,
                        password: "PA$$W0RD",
                    },
                    false,
                );
                expect(actual).toEqual(expected);
            });
        });

        describe("agentType", () => {
            const mockList = [mockedUserCheckService.passwordValidator];
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw if agentType is wrong", () => {
                // @ts-expect-error: private method
                const actual = userService.validateUserProfileData({
                    ...validInput,
                    agentType: "WRONG_VALUE",
                });
                expect(actual).toMatchSnapshot();
            });
        });

        describe("typeJob", () => {
            const mockList = [mockedUserCheckService.passwordValidator];
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                // @ts-expect-error: private method
                const actual = userService.validateUserProfileData({
                    ...validInput,
                    agentType: "WRONG_VALUE",
                });
                expect(actual).toMatchSnapshot();
            });
        });

        describe("structure", () => {
            const mockList = [mockedUserCheckService.passwordValidator];
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                // @ts-expect-error: private method
                const actual = userService.validateUserProfileData({
                    ...validInput,
                    structure: 6,
                });
                expect(actual).toMatchSnapshot();
            });
        });

        describe("territorialScope", () => {
            const mockList = [mockedUserCheckService.passwordValidator];
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                // @ts-expect-error: private method
                const actual = userService.validateUserProfileData({
                    ...validInput,
                    territorialScope: "WRONG_SCOPE",
                });
                expect(actual).toMatchSnapshot();
            });
            it("should return true", () => {
                const expected = { valid: true };
                // @ts-expect-error: private method
                const actual = userService.validateUserProfileData(validInput);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("sanitizeActivationUserInfo()", () => {
        beforeAll(() => mockSanitizeUserProfileData.mockRestore());
        afterAll(() => (mockSanitizeUserProfileData = jest.spyOn(userService, "sanitizeUserProfileData")));
        it("should call sanitizeToPlainText()", () => {
            const expected = 2;
            userService.sanitizeUserProfileData(USER_ACTIVATION_INFO);
            expect(sanitizeToPlainText).toHaveBeenCalledTimes(expected);
        });

        it("does not add field", () => {
            jest.mocked(sanitizeToPlainText).mockReturnValueOnce("santitized");
            const expected = 1;
            const sanitized = userService.sanitizeUserProfileData({ service: "smth" });
            const actual = Object.keys(sanitized).length;
            expect(actual).toBe(expected);
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

    describe("disable", () => {
        const USER_ID = USER_WITHOUT_SECRET._id.toString();

        beforeEach(() => mockGetUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET));

        afterEach(() => {
            mockGetUserById.mockReset();
            mockedUserRepository.update.mockReset();
        });

        it("should fetch user from db", async () => {
            await userService.disable(USER_ID);
            expect(mockGetUserById).toHaveBeenCalledWith(USER_ID);
        });

        it("should return false if user fetch failed", async () => {
            mockGetUserById.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await userService.disable(USER_ID);
            expect(actual).toEqual(expected);
        });

        it("should call update", async () => {
            await userService.disable(USER_ID);
            expect(mockedUserRepository.update).toHaveBeenCalledWith(ANONYMIZED_USER);
        });

        it("should return true if update succeed", async () => {
            mockedUserRepository.update.mockResolvedValueOnce(ANONYMIZED_USER);
            const expected = true;
            const actual = await userService.disable(USER_ID);
            expect(actual).toEqual(expected);
        });

        it("should call notify USER_DELETED", async () => {
            await userService.disable(USER_ID);
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_DELETED, {
                email: USER_WITHOUT_SECRET.email,
            });
        });
    });

    describe("resetPassword", () => {
        const PASSWORD = "12345&#Data";
        const RESET_TOKEN = "azeazdazçè!è78789dqzdqDqzd";
        const RESET_DOCUMENT = {
            _id: new ObjectId(),
            userId: new ObjectId(),
            token: "qdqzd234234ffefsfsf!",
            createdAt: new Date(),
        };

        beforeAll(() => {
            // @ts-expect-error: mock
            jest.mocked(bcrypt.hash).mockResolvedValue(PASSWORD);
            // @ts-expect-error: mock
            mockValidateResetToken.mockImplementation(() => ({ valid: true }));
        });

        beforeEach(() => {
            mockedUserResetRepository.findByToken.mockResolvedValue(RESET_DOCUMENT);
            mockGetUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserRepository.update.mockResolvedValue(USER_WITHOUT_PASSWORD);
            mockedUserCheckService.passwordValidator.mockReturnValue(true);
            mockedUserAuthService.updateJwt.mockImplementation(
                jest.fn(user => Promise.resolve({ ...user, jwt: USER_SECRETS.jwt })),
            );
        });

        afterAll(() => {
            jest.mocked(bcrypt.hash).mockReset();
            mockedUserResetRepository.findByToken.mockReset();
            mockGetUserById.mockReset();
            mockedUserCheckService.passwordValidator.mockReset();
            mockedUserRepository.update.mockReset();
            mockedUserAuthService.updateJwt.mockReset();
        });

        it("should call validateResetToken()", async () => {
            await userService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockValidateResetToken).toHaveBeenCalledTimes(1);
        });

        it("should reject because user not found", async () => {
            mockGetUserById.mockResolvedValueOnce(null);
            expect(userService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(
                new NotFoundError("User not found", ResetPasswordErrorCodes.USER_NOT_FOUND),
            );
        });

        it("should reject because password not valid", async () => {
            mockedUserCheckService.passwordValidator.mockReturnValueOnce(false);
            expect(userService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(
                new BadRequestError(
                    UserService.PASSWORD_VALIDATOR_MESSAGE,
                    ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
                ),
            );
        });

        it("should remove resetUser", async () => {
            await userService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedUserResetRepository.remove).toHaveBeenCalledWith(RESET_DOCUMENT);
        });

        it("should notify USER_ACTIVATED", async () => {
            await userService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_ACTIVATED, {
                email: USER_EMAIL,
            });
        });

        it("should update user", async () => {
            mockedUserAuthService.getHashPassword.mockResolvedValueOnce(PASSWORD);
            await userService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedUserRepository.update).toHaveBeenCalledWith(
                {
                    ...USER_WITHOUT_SECRET,
                    hashPassword: PASSWORD,
                    active: true,
                },
                true,
            );
        });

        it("update user's jwt", async () => {
            await userService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedUserAuthService.updateJwt).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                jwt: USER_SECRETS.jwt,
            });
        });

        it("returns user with jwt", async () => {
            const expected = USER_ACTIVATION_INFO;
            const actual = await userService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(actual).toEqual({
                ...USER_WITHOUT_SECRET,
                jwt: USER_SECRETS.jwt,
            });
        });
    });

    describe("isRoleValid", () => {
        it("should return true", () => {
            const expected = true;
            const role = RoleEnum.consumer;
            const actual = userService.isRoleValid(role);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const expected = false;
            const actual = userService.isRoleValid("not-a-role");
            expect(actual).toEqual(expected);
        });
    });

    describe("validRoles", () => {
        it("should return true", () => {
            const roles = [RoleEnum.admin, RoleEnum.user];
            const expected = true;
            const actual = userService.validRoles(roles);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const roles = ["foo", RoleEnum.user];
            const expected = false;
            const actual = userService.validRoles(roles);
            expect(actual).toEqual(expected);
        });
    });

    describe("findAndSortByPeriod()", () => {
        const REPO_RETURN = {};
        const END = new Date();
        const BEGIN = new Date(END.getFullYear() - 1, END.getMonth(), END.getDay() + 1);
        const WITH_ADMIN = true;

        // @ts-expect-error: mock return value
        beforeAll(() => mockedUserRepository.findByPeriod.mockResolvedValue(REPO_RETURN));
        afterAll(() => mockedUserRepository.findByPeriod.mockReset());

        it("should call repo with given args", async () => {
            await userService.findByPeriod(BEGIN, END, WITH_ADMIN);
            expect(mockedUserRepository.findByPeriod).toBeCalledWith(BEGIN, END, WITH_ADMIN);
        });

        it("should call repo with default", async () => {
            await userService.findByPeriod(BEGIN, END);
            expect(mockedUserRepository.findByPeriod).toBeCalledWith(BEGIN, END, false);
        });

        it("should return repo's return value", async () => {
            const expected = REPO_RETURN;
            const actual = await userService.findByPeriod(BEGIN, END);
            expect(actual).toBe(expected);
        });
    });

    describe("countTotalUsersOnDate()", () => {
        const REPO_RETURN = 5;
        const DATE = new Date();
        const WITH_ADMIN = true;

        beforeAll(() => mockedUserRepository.countTotalUsersOnDate.mockResolvedValue(REPO_RETURN));
        afterAll(() => mockedUserRepository.countTotalUsersOnDate.mockRestore());

        it("should call repo with given args", async () => {
            await userService.countTotalUsersOnDate(DATE, WITH_ADMIN);
            expect(mockedUserRepository.countTotalUsersOnDate).toBeCalledWith(DATE, WITH_ADMIN);
        });

        it("should call repo with default", async () => {
            await userService.countTotalUsersOnDate(DATE);
            expect(mockedUserRepository.countTotalUsersOnDate).toBeCalledWith(DATE, false);
        });

        it("should return repo's return value", async () => {
            const expected = REPO_RETURN;
            const actual = await userService.countTotalUsersOnDate(DATE);
            expect(actual).toBe(expected);
        });
    });

    describe("getAllData", () => {
        let findConsumerTokenSpy: jest.SpyInstance;
        let getAllStatsVisitsByUserSpy: jest.SpyInstance;
        let getAllLogUserSpy: jest.SpyInstance;

        beforeAll(() => {
            findConsumerTokenSpy = jest.spyOn(consumerTokenRepository, "find");
            getAllStatsVisitsByUserSpy = jest.spyOn(statsService, "getAllVisitsUser");
            getAllLogUserSpy = jest.spyOn(statsService, "getAllLogUser");
        });

        afterAll(() => {
            findConsumerTokenSpy.mockRestore();
            getAllStatsVisitsByUserSpy.mockRestore();
            getAllLogUserSpy.mockRestore();
        });

        it("should getting user", async () => {
            mockGetUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(mockGetUserById).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should throw error when user is not found", async () => {
            mockGetUserById.mockResolvedValueOnce(null);
            const method = () => userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(method).rejects.toThrowError(NotFoundError);
        });

        it("should getting user resets", async () => {
            mockGetUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(mockedUserResetRepository.findByUserId).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should getting user consumer tokens", async () => {
            mockGetUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(findConsumerTokenSpy).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should call uniformizeId()", async () => {
            const USER_ID = new ObjectId();
            const _ID = new ObjectId();

            mockGetUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([
                // @ts-expect-error: mock return value
                {
                    userId: USER_ID,
                    _id: _ID,
                },
            ]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            const actual = await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(repositoryHelper.uniformizeId).toHaveBeenCalledTimes(1);
        });

        it("should getting user visits stats", async () => {
            mockGetUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(getAllStatsVisitsByUserSpy).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should getting return visits stats", async () => {
            const expected = { userId: new ObjectId().toString() };
            mockGetUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([{ userId: new ObjectId(expected.userId) }]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            const actual = await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(actual.statistics.associationVisit).toEqual(expect.arrayContaining([expected]));
        });

        it("should getting user logs", async () => {
            mockGetUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(getAllLogUserSpy).toBeCalledWith(USER_WITHOUT_SECRET.email);
        });

        it("should getting return logs", async () => {
            const expected = { userId: new ObjectId() };
            mockGetUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([expected]);

            const actual = await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(actual.logs).toEqual(expect.arrayContaining([expected]));
        });
    });

    describe("isExpiredReset", () => {
        it("should return true", () => {
            const reset = {
                createdAt: new Date(2000),
            } as unknown as UserReset;

            // @ts-expect-error is ExpiredReset is private
            const actual = userService.isExpiredReset(reset);

            expect(actual).toBeTruthy();
        });

        it("should return false", () => {
            const reset = {
                createdAt: new Date(),
            } as unknown as UserReset;

            // @ts-expect-error is ExpiredReset is private
            const actual = userService.isExpiredReset(reset);

            expect(actual).toBeFalsy();
        });
    });

    describe("validateTokenAndGetType", () => {
        const FAKE_TOKEN = "FAKE";
        const validUserReset = {
            // userId: "1FR13J414N",
            createdAt: new Date(),
        } as unknown as WithId<UserReset>;
        const user = {
            profileToComplete: true,
        } as unknown as UserDto;

        beforeAll(() => {
            mockedUserResetRepository.findByToken.mockResolvedValue(validUserReset);
            // @ts-expect-error: mock
            mockValidateResetToken.mockImplementation(() => ({ valid: true }));
            mockGetUserById.mockResolvedValue(user);
        });

        afterAll(() => {
            mockedUserResetRepository.findByToken.mockReset();
            mockValidateResetToken.mockReset();
            mockGetUserById.mockReset();
        });

        it("should call find by token", async () => {
            await userService.validateTokenAndGetType(FAKE_TOKEN);

            expect(mockedUserResetRepository.findByToken).toBeCalledWith(FAKE_TOKEN);
        });

        it("should return true", async () => {
            const actual = await userService.validateTokenAndGetType(FAKE_TOKEN);
            expect(actual.valid).toBeTruthy();
        });

        it("should call validateResetToken", async () => {
            await userService.validateTokenAndGetType(FAKE_TOKEN);

            expect(mockValidateResetToken).toHaveBeenCalledWith(validUserReset);
        });

        it("should return type is SIGNUP", async () => {
            //@ts-expect-error: mock
            mockedUserResetRepository.findByToken.mockResolvedValueOnce({
                createdAt: new Date(),
            });
            const actual = (await userService.validateTokenAndGetType(
                FAKE_TOKEN,
            )) as TokenValidationDtoPositiveResponse;

            expect(actual.type).toBe(TokenValidationType.SIGNUP);
        });

        it("should return type is FORGET_PASSWORD", async () => {
            // @ts-expect-error: mock
            mockedUserResetRepository.findByToken.mockResolvedValueOnce({
                createdAt: new Date(),
            });

            // @ts-expect-error: mock
            mockGetUserById.mockResolvedValueOnce({
                profileToComplete: false,
            });

            const actual = (await userService.validateTokenAndGetType(
                FAKE_TOKEN,
            )) as TokenValidationDtoPositiveResponse;

            expect(actual.type).toBe(TokenValidationType.FORGET_PASSWORD);
        });
    });

    describe("profileUpdate", () => {
        const mockList = [mockValidateUserProfileDataUser, mockSanitizeUserProfileData];
        beforeAll(() => {
            // @ts-expect-error: mock
            mockValidateUserProfileDataUser.mockReturnValue({ valid: true });
            mockSanitizeUserProfileData.mockImplementation(userInfo => userInfo);
            mockedUserRepository.update.mockResolvedValue({ ...USER_DBO, ...USER_ACTIVATION_INFO });
        });
        afterAll(() => mockList.forEach(mock => mock.mockReset()));

        it("should call validateUserProfileData() without testing password", async () => {
            const expected = { ...USER_WITHOUT_SECRET, ...USER_ACTIVATION_INFO };
            await userService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(mockValidateUserProfileDataUser).toHaveBeenCalledWith(expected, false);
        });

        it("should call sanitizeUserProfileData()", async () => {
            const expected = USER_ACTIVATION_INFO;
            await userService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(mockSanitizeUserProfileData).toHaveBeenCalledWith(expected);
        });

        it("should call userRepository.update() with sanitized data", async () => {
            await userService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(userRepository.update).toHaveBeenCalledWith({ ...USER_WITHOUT_SECRET, ...USER_ACTIVATION_INFO });
        });

        it("should notify user updated", async () => {
            mockedUserRepository.update.mockResolvedValue(USER_WITHOUT_SECRET);
            await userService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_UPDATED, USER_WITHOUT_SECRET);
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

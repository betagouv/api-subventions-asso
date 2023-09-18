const SIGNED_TOKEN = "SIGNED_TOKEN";
const jwtVerifyMock = jest.fn();
const jwtSignMock = jest.fn(() => SIGNED_TOKEN);
jest.mock("jsonwebtoken", () => ({
    __esModule: true, // this property makes it work
    default: {
        verify: jwtVerifyMock,
        sign: jwtSignMock,
    },
}));
import { BadRequestError, InternalServerError, NotFoundError } from "../../shared/errors/httpErrors";
import bcrypt from "bcrypt";
jest.mock("bcrypt");
import { sanitizeToPlainText } from "../../shared/helpers/StringHelper";
jest.mock("../../shared/helpers/StringHelper");
import * as JWT_CONF from "../../configurations/jwt.conf";
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

import mocked = jest.mocked;
import userService, { UserService, UserServiceErrors } from "./user.service";
import { ObjectId, WithId } from "mongodb";
import { RoleEnum } from "../../@enums/Roles";
import { UserDto } from "dto";
import UserReset from "./entities/UserReset";
import configurationsService from "../configurations/configurations.service";
import UserDbo from "./repositories/dbo/UserDbo";
import { LoginDtoErrorCodes, ResetPasswordErrorCodes, UserErrorCodes } from "dto";
import LoginError from "../../shared/errors/LoginError";
import { USER_EMAIL } from "../../../tests/__helpers__/userHelper";
import statsService from "../stats/stats.service";
import { NotificationType } from "../notify/@types/NotificationType";
import { TokenValidationDtoPositiveResponse } from "dto";
import { TokenValidationType } from "dto";
import { AgentTypeEnum } from "dto";
import { AgentJobTypeEnum, TerritorialScopeEnum } from "dto";
import { removeSecrets } from "../../shared/helpers/RepositoryHelper";

jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

const USER_WITHOUT_SECRET = {
    _id: new ObjectId("635132a527c9bfb8fc7c758e"),
    email: USER_EMAIL,
    roles: ["user"],
    signupAt: new Date(),
    firstName: "",
    lastName: "",
    active: true,
    profileToComplete: false,
} as UserDto;

const UNACTIVATED_USER = { ...USER_WITHOUT_SECRET, ...{ active: false, profileToComplete: true } };

const USER_SECRETS = {
    jwt: { token: SIGNED_TOKEN, expirateDate: new Date() },
    hashPassword: "HASH_PASSWORD",
};

const USER_DBO = { ...USER_WITHOUT_SECRET, ...USER_SECRETS };

const USER_WITHOUT_PASSWORD = {
    ...USER_WITHOUT_SECRET,
    jwt: USER_SECRETS.jwt,
};

const CONSUMER_USER = { ...USER_WITHOUT_SECRET, roles: ["user", "consumer"] };

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
    const mockSanitizeActivationUserInfo = jest.spyOn(userService, "sanitizeActivationUserInfo");
    // @ts-expect-error: mock private method
    const mockValidateResetToken: jest.SpyInstance<boolean> = jest.spyOn(userService, "validateResetToken");
    // @ts-expect-error: mock private method
    const mockGetHashPassword = jest.spyOn(userService, "getHashPassword");
    //@ts-expect-error: mock private method
    const mockBuildJWTToken: SpyInstance = jest.spyOn(userService, "buildJWTToken");
    // @ts-expect-error: mock private method
    const mockPasswordValidator = jest.spyOn(userService, "passwordValidator");
    const mockValidateUserActivationInfo: jest.SpyInstance<boolean> = jest.spyOn(
        userService,
        // @ts-expect-error: mock private method
        "validateUserActivationInfo",
    );
    // @ts-expect-error: mock private method
    const mockValidateEmail = jest.spyOn(userService, "validateEmail");
    const mockGetUserById = jest.spyOn(userService, "getUserById");

    beforeAll(() => mockedUserRepository.getUserWithSecretsByEmail.mockImplementation(async () => USER_DBO));

    beforeEach(() => {
        jest.mocked(bcrypt.compare).mockImplementation(async () => true);
        mockBuildJWTToken.mockImplementation(() => "SIGNED_TOKEN");
        jwtVerifyMock.mockImplementation(() => ({
            token: "TOKEN",
            now: new Date(),
        }));
    });

    afterEach(() => {
        jwtVerifyMock.mockRestore();
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

    describe("activate", () => {
        const RESET_DOCUMENT = {
            _id: new ObjectId(),
            userId: new ObjectId(),
            token: "qdqzd234234ffefsfsf!",
            createdAt: new Date(),
        };

        const mockList = [
            mockValidateUserActivationInfo,
            mockSanitizeActivationUserInfo,
            mockGetHashPassword,
            mockedUserResetRepository.findByToken,
            mockValidateResetToken,
        ];
        beforeAll(() => {
            // @ts-expect-error: mock
            mockValidateUserActivationInfo.mockImplementation(() => ({
                valid: true,
            }));
            // @ts-expect-error: mock
            mockValidateResetToken.mockImplementation(token => ({ valid: true }));
            mockSanitizeActivationUserInfo.mockImplementation(userInfo => userInfo);
            // @ts-expect-error: unknown error
            mockGetHashPassword.mockImplementation(async password => password);
            mockedUserResetRepository.findByToken.mockImplementation(async token => RESET_DOCUMENT);
            // @ts-expect-error: unknown error
            mockedUserRepository.update.mockImplementation(() => ({
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
                hashPassword: "qdqdqzdqzd&",
            }));
            mockGetUserById.mockImplementation(async id => UNACTIVATED_USER);
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
            });
        });

        it("should call validateAndSanitizeActivationUserInfo()", async () => {
            const expected = USER_ACTIVATION_INFO;
            await userService.activate("token", USER_ACTIVATION_INFO);
            expect(mockSanitizeActivationUserInfo).toHaveBeenCalledWith(expected);
        });
    });

    describe("validateUserActivationInfo()", () => {
        beforeAll(() => mockValidateUserActivationInfo.mockRestore());
        // @ts-expect-error: mock
        afterAll(() => mockValidateUserActivationInfo.mockImplementation(() => ({ valid: true })));

        describe("password", () => {
            // @ts-expect-error: mock private method
            beforeAll(() => mockPasswordValidator.mockImplementationOnce(() => false));
            it("should throw password is wrong", () => {
                try {
                    // @ts-expect-error: private method
                    userService.validateUserActivationInfo({
                        password: "PA$$W0RD",
                    });
                } catch (e) {
                    expect(e).toMatchSnapshot();
                }
            });
        });

        describe("agentType", () => {
            const mockList = [mockPasswordValidator];
            // @ts-expect-error: mock private method
            beforeAll(() => mockPasswordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw if agentType is wrong", () => {
                try {
                    // @ts-expect-error: private method
                    userService.validateUserActivationInfo({
                        agentType: "WRONG_VALUE",
                    });
                } catch (e) {
                    expect(e).toMatchSnapshot();
                }
            });
        });

        describe("typeJob", () => {
            const mockList = [mockPasswordValidator];
            // @ts-expect-error: mock private method
            beforeAll(() => mockPasswordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                try {
                    // @ts-expect-error: private method
                    userService.validateUserActivationInfo({
                        agentType: AgentTypeEnum.CENTRAL_ADMIN,
                        jobType: ["WRONG_TYPE"],
                    });
                } catch (e) {
                    expect(e).toMatchSnapshot();
                }
            });

            it.each`
                jobType
                ${[]}
                ${[AgentJobTypeEnum.ADMINISTRATOR]}
                ${[AgentJobTypeEnum.ADMINISTRATOR, AgentJobTypeEnum.OTHER]}
            `("should throw an error", ({ jobType }) => {
                // @ts-expect-error: private method
                userService.validateUserActivationInfo({
                    agentType: AgentTypeEnum.CENTRAL_ADMIN,
                    jobType,
                });
            });
        });

        describe("structure", () => {
            const mockList = [mockPasswordValidator];
            // @ts-expect-error: mock private method
            beforeAll(() => mockPasswordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                try {
                    // @ts-expect-error: private method
                    userService.validateUserActivationInfo({
                        agentType: AgentTypeEnum.CENTRAL_ADMIN,
                        jobType: [AgentJobTypeEnum.EXPERT],
                        structure: 6,
                    });
                } catch (e) {
                    expect(e).toMatchSnapshot();
                }
            });
        });

        describe("territorialScope", () => {
            const mockList = [mockPasswordValidator];
            // @ts-expect-error: mock private method
            beforeAll(() => mockPasswordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                try {
                    // @ts-expect-error: private method
                    userService.validateUserActivationInfo({
                        agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
                        jobType: [AgentJobTypeEnum.EXPERT],
                        structure: "STRUCTURE",
                        territorialScope: "WRONG_SCOPE",
                    });
                } catch (e) {
                    expect(e).toMatchSnapshot();
                }
            });
            it("should return true", () => {
                const expected = { valid: true };
                // @ts-expect-error: private method
                const actual = userService.validateUserActivationInfo({
                    agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
                    jobType: [AgentJobTypeEnum.EXPERT],
                    structure: "STRUCTURE",
                    territorialScope: TerritorialScopeEnum.COMMUNAL,
                });
                console.log(actual);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("sanitizeActivationUserInfo()", () => {
        beforeAll(() => mockSanitizeActivationUserInfo.mockRestore());
        it("should call sanitizeToPlainText()", () => {
            const expected = 4;
            userService.sanitizeActivationUserInfo(USER_ACTIVATION_INFO);
            expect(sanitizeToPlainText).toHaveBeenCalledTimes(expected);
        });
    });

    describe("login", () => {
        it("should throw an Error if user not found", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(async () => null);
            const expected = new LoginError();
            const test = async () => await userService.login(USER_DBO.email, "PASSWORD");
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should throw an Error if user is not active", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(async () => ({
                ...USER_DBO,
                active: false,
            }));
            const expected = {
                message: "User is not active",
                code: LoginDtoErrorCodes.USER_NOT_ACTIVE,
            };
            const test = async () => await userService.login(USER_DBO.email, "PASSWORD");
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should throw LoginError password do not match", async () => {
            jest.mocked(bcrypt.compare).mockImplementationOnce(async () => false);
            const expected = new LoginError();
            const test = async () => await userService.login(USER_DBO.email, "PASSWORD");
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should generate new token and update user", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockResolvedValueOnce(JSON.parse(JSON.stringify(USER_DBO)));
            // minus two days
            const oldDate = new Date(Date.now() - 172800001);
            jwtVerifyMock.mockImplementation(() => ({
                token: "TOKEN",
                now: oldDate,
            }));
            await userService.login(USER_DBO.email, "PASSWORD");
            expect(mockBuildJWTToken).toHaveBeenCalledTimes(1);
            expect(userRepository.update).toHaveBeenCalledTimes(1);
        });

        it("should return user", async () => {
            const expected = USER_WITHOUT_PASSWORD;
            const actual = await userService.login(USER_DBO.email, "PASSWORD");
            expect(actual).toEqual(expected);
        });

        it("should notify USER_LOGGED", async () => {
            mockResetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateUser.mockImplementationOnce(async () => ({} as UserDto));
            await userService.login(USER_DBO.email, "PASSWORD");
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_LOGGED, {
                email: USER_DBO.email,
                date: expect.any(Date),
            });
        });
    });

    describe("authenticate", () => {
        const DECODED_TOKEN = { ...USER_WITHOUT_SECRET, now: (d => new Date(d.setDate(d.getDate() + 1)))(new Date()) };
        it("should throw error if user does not exist", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(jest.fn());
            const expected = { message: "User not found", code: UserServiceErrors.USER_NOT_FOUND };
            const test = async () => await userService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return UserDtoSuccessResponse consumer token", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(
                async () => ({ ...CONSUMER_USER, ...USER_SECRETS } as UserDbo),
            );
            const expected = CONSUMER_USER;
            const actual = await userService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            expect(actual).toEqual(expected);
        });

        it("should return UserDtoSuccessResponse user token", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(async () => USER_DBO);
            const expected = USER_WITHOUT_SECRET;
            const actual = await userService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            expect(actual).toEqual(expected);
        });

        it("should return UserServiceError if user not active", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(async () => ({
                ...USER_DBO,
                active: false,
            }));
            const expected = { message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE };
            const test = async () => await userService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return UserServiceError if token has expired", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(async () => USER_DBO);
            const expected = {
                message: "JWT has expired, please login try again",
                code: UserServiceErrors.LOGIN_UPDATE_JWT_FAIL,
            };
            const test = () =>
                userService.authenticate(
                    {
                        ...DECODED_TOKEN,
                        now: (d => new Date(d.setDate(d.getDate() - 3)))(new Date()),
                    },
                    USER_SECRETS.jwt.token,
                );
            await expect(test).rejects.toMatchObject(expected);
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
            await userService.createConsumer(USER_EMAIL);
            expect(mockCreateUser).toBeCalledTimes(1);
        });

        it("should not create consumer token if user creation failed", async () => {
            mockCreateUser.mockRejectedValueOnce(new Error());
            await userService.createConsumer(USER_EMAIL).catch(() => {});
            expect(mockCreateUser).toBeCalledTimes(1);
        });

        it("should create a token ", async () => {
            const expected = CONSUMER_JWT_PAYLOAD;
            mockCreateUser.mockImplementationOnce(async () => USER_WITHOUT_SECRET);
            await userService.createConsumer({ email: USER_EMAIL });
            expect(mockBuildJWTToken).toHaveBeenCalledWith(expected, {
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

    describe("validateSanitizeUser", () => {
        let validRolesMock;

        beforeAll(() => {
            jest.mocked(mockedUserRepository.findByEmail).mockResolvedValue(null);
            jest.mocked(sanitizeToPlainText).mockReturnValue("safeString");
            // @ts-expect-error: mock
            mockValidateEmail.mockResolvedValue(undefined);
            // @ts-expect-error private method
            validRolesMock = jest.spyOn(userService, "validRoles").mockResolvedValue(true);
        });

        afterAll(() => {
            jest.mocked(mockedUserRepository.findByEmail).mockReset();
            mockValidateEmail.mockRestore();
            validRolesMock.mockRestore();
            jest.mocked(sanitizeToPlainText).mockReset();
        });

        it("look for user with this email if newUser", async () => {
            await userService.validateSanitizeUser({ email: USER_EMAIL }, true);
            expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(USER_EMAIL);
        });

        it("does not look for user with this email if not newUser", async () => {
            await userService.validateSanitizeUser({ email: USER_EMAIL }, false);
            expect(mockedUserRepository.findByEmail).not.toHaveBeenCalled();
        });

        it("validates roles", async () => {
            const roles = ["ratata", "tralala"];
            await userService.validateSanitizeUser({ email: USER_EMAIL, roles }, false);
            expect(validRolesMock).toHaveBeenCalledWith(roles);
        });

        it.each`
            variableName
            ${"firstName"}
            ${"lastName"}
        `("if $variableName is set, call sanitizer with it", async ({ variableName }) => {
            await userService.validateSanitizeUser({ email: USER_EMAIL, [variableName]: "something" });
            expect(sanitizeToPlainText).toHaveBeenCalledWith("something");
        });
    });

    describe("createUser", () => {
        let validateUserMock;
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
            validateUserMock = jest.spyOn(userService, "validateSanitizeUser").mockImplementation(undefined);
            mockBuildJWTToken.mockReturnValue(SIGNED_TOKEN);
        });

        afterAll(() => {
            jest.mocked(mockedUserRepository.findByEmail).mockReset();
            validateUserMock.mockReset();
            jest.mocked(bcrypt.hash).mockReset();
        });

        it("sets default role", async () => {
            await userService.createUser({ email: USER_EMAIL });
            expect(validateUserMock).toHaveBeenCalledWith({ email: USER_EMAIL, roles: [RoleEnum.user] });
        });

        it("validates user object", async () => {
            await userService.createUser(FUTURE_USER);
            expect(validateUserMock).toHaveBeenCalledWith(FUTURE_USER);
        });

        it("calls repository creation with sanitized values", async () => {
            validateUserMock.mockImplementation(async user => (user.firstName = "Jocelyne"));
            await userService.createUser({ ...FUTURE_USER, firstName: "BadJocelyne" });
            const expected = FUTURE_USER;
            const actual = jest.mocked(mockedUserRepository.create).mock.calls[0][0];
            expect(actual).toMatchObject(expected);
        });

        it("ignores properties that should not be saved", async () => {
            // @ts-expect-error testing purposes
            await userService.createUser({ ...FUTURE_USER, randomProperty: "lalala" });
            const expected = FUTURE_USER;
            const actual = jest.mocked(mockedUserRepository.create).mock.calls[0][0];
            expect(actual).toMatchObject(expected);
        });
    });

    describe("updatePassword", () => {
        const PASSWORD = "12345&#Data";

        it("should reject because password not valid", async () => {
            // @ts-expect-error: mock private method return value
            mockPasswordValidator.mockReturnValue(false);
            expect(userService.updatePassword(USER_WITHOUT_SECRET, PASSWORD)).rejects.toEqual(
                new BadRequestError(UserService.PASSWORD_VALIDATOR_MESSAGE, UserErrorCodes.INVALID_PASSWORD),
            );
        });

        it("should update user", async () => {
            // @ts-expect-error: mock private method return value
            mockPasswordValidator.mockReturnValue(true);
            await userService.updatePassword(USER_WITHOUT_SECRET, PASSWORD);
            expect(mockedUserRepository.update).toHaveBeenCalledWith(USER_WITHOUT_SECRET);
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
            // @ts-expect-error: mock
            mockedUserRepository.update.mockResolvedValue({ ...USER_WITHOUT_PASSWORD, hashPassord: "éfqzdqzdoqzj" });
            // @ts-expect-error: mock private method return value
            mockPasswordValidator.mockReturnValue(true);
        });

        afterAll(() => {
            jest.mocked(bcrypt.hash).mockReset();
            mockedUserResetRepository.findByToken.mockReset();
            mockGetUserById.mockReset();
            mockPasswordValidator.mockReset();
            mockedUserRepository.update.mockReset();
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
            // @ts-expect-error: mock private method return value
            mockPasswordValidator.mockReturnValueOnce(false);
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
            //@ts-expect-error: mock
            mockGetHashPassword.mockResolvedValueOnce(PASSWORD);
            await userService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedUserRepository.update).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                hashPassword: PASSWORD,
                active: true,
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
            // @ts-expect-error: test private method
            const actual = userService.validRoles(roles);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const roles = ["foo", RoleEnum.user];
            const expected = false;
            // @ts-expect-error: test private method
            const actual = userService.validRoles(roles);
            expect(actual).toEqual(expected);
        });
    });

    describe("validateEmail()", () => {
        const isDomainAcceptedMock = jest
            .spyOn(configurationsService, "isDomainAccepted")
            .mockImplementation(async () => true);
        const EMAIL = "daemon.targaryen@ac-pentos.ws";

        it("should verify domain", async () => {
            //@ts-expect-error: private method
            await userService.validateEmail(EMAIL);
            expect(isDomainAcceptedMock).toHaveBeenCalledWith(EMAIL);
        });

        it("should return if email is correct", async () => {
            //@ts-expect-error: private method
            await userService.validateEmail(EMAIL);
        });

        it("should throw error if not well formatted", async () => {
            const expected = {
                message: "Email is not valid",
                code: UserServiceErrors.CREATE_INVALID_EMAIL,
            };
            //@ts-expect-error: private method
            const test = () => userService.validateEmail();
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should throw error if domain not accepted", async () => {
            isDomainAcceptedMock.mockImplementationOnce(async () => false);
            const expected = {
                message: "Email domain is not accepted",
                code: UserServiceErrors.CREATE_EMAIL_GOUV,
            };
            //@ts-expect-error: private method
            const test = () => userService.validateEmail(EMAIL);
            await expect(test).rejects.toMatchObject(expected);
        });
    });

    describe("buildJWTToken", () => {
        it("should set expiresIn", () => {
            mockBuildJWTToken.mockRestore();
            const expected = {
                expiresIn: JWT_CONF.JWT_EXPIRES_TIME,
            };
            // @ts-expect-error buildJWTToken is private
            userService.buildJWTToken(USER_WITHOUT_SECRET, { expiration: true });
            expect(jwtSignMock).toHaveBeenCalledWith(
                { ...USER_WITHOUT_SECRET, now: new Date() },
                expect.any(String),
                expected,
            );
        });

        it("should not set expiresIn", () => {
            mockBuildJWTToken.mockRestore();
            const expected = {};
            // @ts-expect-error buildJWTToken is private
            userService.buildJWTToken(USER_WITHOUT_SECRET, { expiration: false });
            expect(jwtSignMock).toHaveBeenCalledWith(
                { ...USER_WITHOUT_SECRET, now: new Date() },
                expect.any(String),
                expected,
            );
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

    describe("passwordValidator()", () => {
        beforeAll(() => mockPasswordValidator.mockRestore());

        it("should accept #", () => {
            // @ts-expect-error: private method
            const actual = userService.passwordValidator("Aa12345#");
            expect(actual).toEqual(true);
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

        it("should transform object id to string", async () => {
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

            expect(actual).toEqual(
                expect.objectContaining({
                    tokens: expect.arrayContaining([
                        expect.objectContaining({
                            _id: _ID.toString(),
                            userId: USER_ID.toString(),
                        }),
                    ]),
                }),
            );
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

    describe("getUserWithoutSecret", () => {
        const EMAIL = "user@mail.fr";

        it("gets user from repo", async () => {
            jest.mocked(userRepository.getUserWithSecretsByEmail).mockResolvedValueOnce(USER_DBO);
            await userService.getUserWithoutSecret(EMAIL);
            expect(userRepository.getUserWithSecretsByEmail).toHaveBeenCalledWith(EMAIL);
        });

        it("return without secrets", async () => {
            jest.mocked(userRepository.getUserWithSecretsByEmail).mockResolvedValueOnce(USER_DBO);
            const actual = await userService.getUserWithoutSecret(EMAIL);
            expect(actual).toMatchSnapshot();
        });

        it("throws not found if noe found", async () => {
            jest.mocked(userRepository.getUserWithSecretsByEmail).mockResolvedValueOnce(null);
            const test = () => userService.getUserWithoutSecret(EMAIL);
            await expect(test).rejects.toMatchInlineSnapshot(`[Error: User not found]`);
        });
    });
});

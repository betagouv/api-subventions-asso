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
import UserDto from "@api-subventions-asso/dto/user/UserDto";
import UserReset from "./entities/UserReset";
import configurationsService from "../configurations/configurations.service";
import UserDbo from "./repositories/dbo/UserDbo";
import { LoginDtoErrorCodes, ResetPasswordErrorCodes, UserErrorCodes } from "@api-subventions-asso/dto";
import LoginError from "../../shared/errors/LoginError";
import { USER_EMAIL } from "../../../tests/__helpers__/userHelper";
import statsService from "../stats/stats.service";
import { NotificationType } from "../notify/@types/NotificationType";
import { TokenValidationDtoPositiveResponse } from "@api-subventions-asso/dto";
import { TokenValidationType } from "@api-subventions-asso/dto";

jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

describe("User Service", () => {
    const createTokenMock = jest.spyOn(consumerTokenRepository, "create").mockImplementation(jest.fn());
    const resetUserMock = jest.spyOn(userService, "resetUser");
    const createUserMock = jest.spyOn(userService, "createUser");
    const createConsumerMock = jest.spyOn(userService, "createConsumer");
    //@ts-expect-error: mock private method
    const buildJWTTokenMock: SpyInstance = jest.spyOn(userService, "buildJWTToken");
    const getUserWithSecretsByEmailMock = jest
        .spyOn(mockedUserRepository, "getUserWithSecretsByEmail")
        .mockImplementation(async () => USER_DBO);
    const updateMock = jest.spyOn(mockedUserRepository, "update").mockImplementation(async () => USER_DBO);

    const USER_WITHOUT_SECRET = {
        _id: new ObjectId("635132a527c9bfb8fc7c758e"),
        email: USER_EMAIL,
        roles: ["user"],
        signupAt: new Date(),
        firstName: "",
        lastName: "",
        active: true,
        profileCompleted: true,
    } as UserDto;
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

    beforeEach(() => {
        jest.mocked(bcrypt.compare).mockImplementation(async () => true);
        buildJWTTokenMock.mockImplementation(() => "SIGNED_TOKEN");
        jwtVerifyMock.mockImplementation(() => ({
            token: "TOKEN",
            now: new Date(),
        }));
    });

    afterEach(() => {
        jwtVerifyMock.mockRestore();
    });

    describe("signup", () => {
        it("should create a consumer", async () => {
            resetUserMock.mockImplementationOnce(async () => ({} as UserReset));
            createConsumerMock.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup({ email: USER_EMAIL }, RoleEnum.consumer);
            expect(createConsumerMock).toHaveBeenCalled();
        });

        it("should create a user", async () => {});

        it("should create a reset token", async () => {
            resetUserMock.mockImplementationOnce(async () => ({} as UserReset));
            createUserMock.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup({ email: USER_EMAIL });
            expect(resetUserMock).toHaveBeenCalled();
        });

        it("should notify USER_CREATED", async () => {
            resetUserMock.mockImplementationOnce(async () => ({} as UserReset));
            createUserMock.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup({ email: USER_EMAIL });
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(
                NotificationType.USER_CREATED,
                expect.objectContaining({ email: USER_EMAIL }),
            );
        });

        it("should return a user", async () => {
            const expected = { email: USER_EMAIL };
            resetUserMock.mockImplementationOnce(async () => ({} as UserReset));
            createUserMock.mockImplementationOnce(async () => expected as UserDto);
            const actual = await userService.signup({ email: USER_EMAIL });
            expect(actual).toEqual(expected);
        });
    });

    describe("login", () => {
        it("should throw an Error if user not found", async () => {
            getUserWithSecretsByEmailMock.mockImplementationOnce(async () => null);
            const expected = new LoginError();
            const test = async () => await userService.login(USER_DBO.email, "PASSWORD");
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should throw an Error if user is not active", async () => {
            getUserWithSecretsByEmailMock.mockImplementationOnce(async () => ({
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
            getUserWithSecretsByEmailMock.mockResolvedValueOnce(JSON.parse(JSON.stringify(USER_DBO)));
            // minus two days
            const oldDate = new Date(Date.now() - 172800001);
            jwtVerifyMock.mockImplementation(() => ({
                token: "TOKEN",
                now: oldDate,
            }));
            await userService.login(USER_DBO.email, "PASSWORD");
            expect(buildJWTTokenMock).toHaveBeenCalledTimes(1);
            expect(updateMock).toHaveBeenCalledTimes(1);
        });

        it("should return user", async () => {
            const expected = USER_WITHOUT_PASSWORD;
            const actual = await userService.login(USER_DBO.email, "PASSWORD");
            expect(actual).toEqual(expected);
        });

        it("should notify USER_LOGGED", async () => {
            resetUserMock.mockImplementationOnce(async () => ({} as UserReset));
            createUserMock.mockImplementationOnce(async () => ({} as UserDto));
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
            getUserWithSecretsByEmailMock.mockImplementationOnce(jest.fn());
            const expected = { message: "User not found", code: UserServiceErrors.USER_NOT_FOUND };
            const test = async () => await userService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return UserDtoSuccessResponse consumer token", async () => {
            getUserWithSecretsByEmailMock.mockImplementationOnce(
                async () => ({ ...CONSUMER_USER, ...USER_SECRETS } as UserDbo),
            );
            const expected = CONSUMER_USER;
            const actual = await userService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            expect(actual).toEqual(expected);
        });

        it("should return UserDtoSuccessResponse user token", async () => {
            getUserWithSecretsByEmailMock.mockImplementationOnce(async () => USER_DBO);
            const expected = USER_WITHOUT_SECRET;
            const actual = await userService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            expect(actual).toEqual(expected);
        });

        it("should return UserServiceError if user not active", async () => {
            getUserWithSecretsByEmailMock.mockImplementationOnce(async () => ({ ...USER_DBO, active: false }));
            const expected = { message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE };
            const test = async () => await userService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return UserServiceError if token has expired", async () => {
            getUserWithSecretsByEmailMock.mockImplementationOnce(async () => USER_DBO);
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
            mockedUserRepository.findById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserRepository.delete.mockResolvedValue(true);
            mocked(mockedUserResetRepository.removeAllByUserId).mockResolvedValue(true);
            mocked(consumerTokenRepository.deleteAllByUserId).mockResolvedValue(true);
        });

        afterAll(() => {
            mockedUserRepository.findById.mockReset();
            mockedUserRepository.delete.mockReset();
            mocked(mockedUserResetRepository.removeAllByUserId).mockReset();
            mocked(consumerTokenRepository.deleteAllByUserId).mockReset();
        });

        it("gets user", async () => {
            await userService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(mockedUserRepository.findById).toHaveBeenCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("returns false if no user without calling other repos", async () => {
            mockedUserRepository.findById.mockResolvedValueOnce(null);
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
    });

    describe("createConsumer", () => {
        let deleteUserMock;

        beforeAll(() => {
            deleteUserMock = jest.spyOn(userService, "delete");
            deleteUserMock.mockImplementation(jest.fn());
            createUserMock.mockImplementation(async () => CONSUMER_USER);
        });
        afterAll(() => {
            deleteUserMock.mockRestore();
            createUserMock.mockRestore();
        });

        it("should call mockedUserRepository.createUser", async () => {
            await userService.createConsumer(USER_EMAIL);
            expect(createUserMock).toBeCalledTimes(1);
        });

        it("should not create consumer token if user creation failed", async () => {
            createUserMock.mockRejectedValueOnce(new Error());
            await userService.createConsumer(USER_EMAIL).catch(() => {});
            expect(createUserMock).toBeCalledTimes(1);
        });

        it("should create a token ", async () => {
            const expected = CONSUMER_JWT_PAYLOAD;
            createUserMock.mockImplementationOnce(async () => USER_WITHOUT_SECRET);
            await userService.createConsumer({ email: USER_EMAIL });
            expect(buildJWTTokenMock).toHaveBeenCalledWith(expected, {
                expiration: false,
            });
        });

        it("should call consumerTokenRepository.create", async () => {
            await userService.createConsumer({ email: USER_EMAIL });
            expect(createTokenMock).toBeCalledTimes(1);
        });

        it("should delete user if token generation failed", async () => {
            createTokenMock.mockRejectedValueOnce(new Error());
            const id = USER_WITHOUT_SECRET._id.toString();
            await userService.createConsumer({ email: USER_EMAIL }).catch(() => {});
            expect(deleteUserMock).toHaveBeenCalledWith(id);
        });

        it("should throw if token generation failed", async () => {
            createTokenMock.mockRejectedValueOnce(new Error());
            const test = () => userService.createConsumer({ email: USER_EMAIL });
            await expect(test).rejects.toMatchObject(
                new InternalServerError("Could not create consumer token", UserServiceErrors.CREATE_CONSUMER_TOKEN),
            );
        });

        it("should return UserDtoSuccessResponse", async () => {
            const expected = CONSUMER_USER;
            createTokenMock.mockImplementationOnce(async () => true);
            const actual = await userService.createConsumer({ email: USER_EMAIL });
            expect(actual).toEqual(expected);
        });
    });

    describe("validateSanitizeUser", () => {
        let validateEmailMock;
        let validRolesMock;

        beforeAll(() => {
            jest.mocked(mockedUserRepository.findByEmail).mockResolvedValue(null);
            jest.mocked(sanitizeToPlainText).mockReturnValue("safeString");
            // @ts-expect-error private method
            validateEmailMock = jest.spyOn(userService, "validateEmail").mockResolvedValue(undefined);
            // @ts-expect-error private method
            validRolesMock = jest.spyOn(userService, "validRoles").mockResolvedValue(true);
        });

        afterAll(() => {
            jest.mocked(mockedUserRepository.findByEmail).mockReset();
            validateEmailMock.mockRestore();
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
            jest.mocked(mockedUserRepository.create).mockResolvedValue(USER_WITHOUT_SECRET);
            // @ts-expect-error - mock
            jest.mocked(bcrypt.hash).mockResolvedValue("hashedPassword");
            validateUserMock = jest.spyOn(userService, "validateSanitizeUser").mockImplementation(undefined);
            buildJWTTokenMock.mockReturnValue(SIGNED_TOKEN);
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
        // @ts-expect-error: mock private method
        const mockPasswordValidator = jest.spyOn(userService, "passwordValidator");
        beforeEach(() => {
            // @ts-expect-error: mock private method return value
            mockPasswordValidator.mockReturnValue(true);
        });

        const PASSWORD = "12345&#Data";

        it("should reject because password not valid", async () => {
            // @ts-expect-error: mock private method return value
            mockPasswordValidator.mockReturnValueOnce(false);
            expect(userService.updatePassword(USER_WITHOUT_SECRET, PASSWORD)).rejects.toEqual(
                new BadRequestError(UserService.PASSWORD_VALIDATOR_MESSAGE, UserErrorCodes.INVALID_PASSWORD),
            );
        });

        it("should update user", async () => {
            await userService.updatePassword(USER_WITHOUT_SECRET, PASSWORD);
            expect(mockedUserRepository.update).toHaveBeenCalledWith(USER_WITHOUT_SECRET);
        });
    });

    describe("disable", () => {
        const USER_ID = USER_WITHOUT_SECRET._id.toString();

        afterEach(() => {
            mockedUserRepository.findById.mockReset();
            mockedUserRepository.update.mockReset();
        });

        it("should fetch user from db", async () => {
            await userService.disable(USER_ID);
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.findById).toHaveBeenCalledWith(USER_ID);
        });

        it("should return false if user fetch failed", async () => {
            mockedUserRepository.findById.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await userService.disable(USER_ID);
            expect(actual).toEqual(expected);
        });

        it("should call update", async () => {
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            await userService.disable(USER_ID);
            expect(mockedUserRepository.update).toHaveBeenCalledWith(ANONYMIZED_USER);
        });

        it("should return true if update succeed", async () => {
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserRepository.update.mockResolvedValueOnce(ANONYMIZED_USER);
            const expected = true;
            const actual = await userService.disable(USER_ID);
            expect(actual).toEqual(expected);
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

        // @ts-expect-error: mock
        beforeAll(() => jest.mocked(bcrypt.hash).mockResolvedValue(PASSWORD));

        // @ts-expect-error: mock private method
        const mockPasswordValidator = jest.spyOn(userService, "passwordValidator");
        beforeEach(() => {
            mockedUserResetRepository.findByToken.mockResolvedValue(RESET_DOCUMENT);
            mockedUserRepository.findById.mockResolvedValue(USER_WITHOUT_SECRET);
            // @ts-expect-error: mock private method return value
            mockPasswordValidator.mockReturnValue(true);
        });

        afterAll(() => {
            jest.mocked(bcrypt.hash).mockReset();
            mockedUserResetRepository.findByToken.mockReset();
            mockedUserRepository.findById.mockReset();
            mockPasswordValidator.mockRestore();
        });

        it("should reject because resetToken not found", async () => {
            mockedUserResetRepository.findByToken.mockResolvedValueOnce(null);
            expect(userService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(
                new NotFoundError("Reset token not found", ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND),
            );
        });

        it("should reject because resetToken has expired", async () => {
            const originalTimeout = UserService.RESET_TIMEOUT;
            UserService.RESET_TIMEOUT = -1;
            await expect(userService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(
                new BadRequestError(
                    "Reset token has expired, please retry forget password",
                    ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED,
                ),
            );
            UserService.RESET_TIMEOUT = originalTimeout;
        });

        it("should reject because user not found", async () => {
            mockedUserRepository.findById.mockResolvedValueOnce(null);
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
            buildJWTTokenMock.mockRestore();
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
            buildJWTTokenMock.mockRestore();
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
        afterAll(() => mockedUserRepository.findByPeriod.mockRestore());

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
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(mockedUserRepository.findById).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should throw error when user is not found", async () => {
            mockedUserRepository.findById.mockResolvedValueOnce(null);
            const method = () => userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(method).rejects.toThrowError(NotFoundError);
        });

        it("should getting user resets", async () => {
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(mockedUserResetRepository.findByUserId).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should getting user consumer tokens", async () => {
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
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

            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
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
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(getAllStatsVisitsByUserSpy).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should getting return visits stats", async () => {
            const expected = { userId: new ObjectId().toString() };
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([{ userId: new ObjectId(expected.userId) }]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            const actual = await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(actual.statistics.associationVisit).toEqual(expect.arrayContaining([expected]));
        });

        it("should getting user logs", async () => {
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([]);
            findConsumerTokenSpy.mockResolvedValueOnce([]);
            getAllStatsVisitsByUserSpy.mockResolvedValueOnce([]);
            getAllLogUserSpy.mockResolvedValueOnce([]);

            await userService.getAllData(USER_WITHOUT_SECRET._id.toString());

            expect(getAllLogUserSpy).toBeCalledWith(USER_WITHOUT_SECRET.email);
        });

        it("should getting return logs", async () => {
            const expected = { userId: new ObjectId() };
            mockedUserRepository.findById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
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

    describe("validateToken", () => {
        let findByToken: jest.SpyInstance;
        let findUser: jest.SpyInstance;

        const FAKE_TOKEN = "FAKE";
        const validUserReset = {
            createdAt: new Date(),
        } as unknown as WithId<UserReset>;
        const user = {
            profileCompleted: false,
        } as unknown as UserDto;

        beforeAll(() => {
            findByToken = jest.spyOn(userResetRepository, "findByToken").mockResolvedValue(validUserReset);
            findUser = jest.spyOn(userRepository, "findById").mockResolvedValue(user);
        });

        afterAll(() => {
            findByToken.mockRestore();
            findUser.mockRestore();
        });

        it("should call find by token", async () => {
            await userService.validateToken(FAKE_TOKEN);

            expect(findByToken).toBeCalledWith(FAKE_TOKEN);
        });

        it("should return true", async () => {
            const actual = await userService.validateToken(FAKE_TOKEN);

            expect(actual.valid).toBeTruthy();
        });

        it("should return false (token not exist)", async () => {
            findByToken.mockResolvedValueOnce(null);
            const actual = await userService.validateToken(FAKE_TOKEN);

            expect(actual.valid).toBeFalsy();
        });

        it("should return false (token expired)", async () => {
            findByToken.mockResolvedValueOnce({
                createdAt: new Date(2000),
            });
            const actual = await userService.validateToken(FAKE_TOKEN);

            expect(actual.valid).toBeFalsy();
        });

        it("should return type is signup", async () => {
            findByToken.mockResolvedValueOnce({
                createdAt: new Date(),
            });
            const actual = (await userService.validateToken(FAKE_TOKEN)) as TokenValidationDtoPositiveResponse;

            expect(actual.type).toBe(TokenValidationType.SIGNUP);
        });

        it("should return type is signup", async () => {
            findByToken.mockResolvedValueOnce({
                createdAt: new Date(),
            });

            findUser.mockResolvedValueOnce({
                profileCompleted: true,
            });

            const actual = (await userService.validateToken(FAKE_TOKEN)) as TokenValidationDtoPositiveResponse;

            expect(actual.type).toBe(TokenValidationType.FORGET_PASSWORD);
        });
    });
});

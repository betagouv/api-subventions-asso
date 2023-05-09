import { InternalServerError } from "../../shared/errors/httpErrors";

const bcryptCompareMock = jest.fn(async () => true);
jest.mock("bcrypt", () => ({
    __esModule: true, // this property makes it work
    default: {
        compare: bcryptCompareMock,
    },
}));
import bcrypt from "bcrypt";

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

import consumerTokenRepository from "./repositories/consumer-token.repository";
import userService, { UserServiceErrors } from "./user.service";
import { ObjectId } from "mongodb";
import { JWT_EXPIRES_TIME } from "../../configurations/jwt.conf";
import { RoleEnum } from "../../@enums/Roles";
import UserDto from "@api-subventions-asso/dto/user/UserDto";
import mailNotifierService from "../mail-notifier/mail-notifier.service";
import UserReset from "./entities/UserReset";
import userRepository from "./repositories/user.repository";
import configurationsService from "../configurations/configurations.service";
import UserDbo from "./repositories/dbo/UserDbo";
import { LoginDtoErrorCodes } from "@api-subventions-asso/dto";

jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

describe("User Service", () => {
    const sendCreationMailMock = jest.spyOn(mailNotifierService, "sendCreationMail").mockImplementationOnce(jest.fn());
    const createTokenMock = jest.spyOn(consumerTokenRepository, "create").mockImplementation(jest.fn());
    const resetUserMock = jest.spyOn(userService, "resetUser");
    const createUserMock = jest.spyOn(userService, "createUser");
    const createConsumerMock = jest.spyOn(userService, "createConsumer");
    const findByEmailMock = jest.spyOn(userService, "findByEmail");
    //@ts-expect-error: mock private method
    const buildJWTTokenMock = jest.spyOn(userService, "buildJWTToken");
    const getUserWithSecretsByEmailMock = jest
        .spyOn(userRepository, "getUserWithSecretsByEmail")
        .mockImplementation(async () => USER_DBO);
    const updateMock = jest.spyOn(userRepository, "update").mockImplementation(async () => USER_DBO);

    const EMAIL = "test@beta.gouv.fr";
    const USER_WITHOUT_SECRET = {
        _id: new ObjectId("635132a527c9bfb8fc7c758e"),
        email: EMAIL,
        roles: ["user"],
        signupAt: new Date(),
        active: true,
        stats: {},
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

    beforeEach(() => {
        // @ts-expect-error: mock
        buildJWTTokenMock.mockImplementation(() => "SIGNED_TOKEN");
        jwtVerifyMock.mockImplementation(() => ({
            token: "TOKEN",
            now: new Date(),
        }));
    });

    afterEach(() => {
        jwtVerifyMock.mockReset();
    });

    describe("signup", () => {
        it("should create a consumer", async () => {
            resetUserMock.mockImplementationOnce(async () => ({} as UserReset));
            createConsumerMock.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup(EMAIL, RoleEnum.consumer);
            expect(createConsumerMock).toHaveBeenCalled();
        });

        it("should create a user", async () => {});

        it("should create a reset token", async () => {
            resetUserMock.mockImplementationOnce(async () => ({} as UserReset));
            createUserMock.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup(EMAIL);
            expect(resetUserMock).toHaveBeenCalled();
        });

        it("should send a mail", async () => {
            resetUserMock.mockImplementationOnce(async () => ({} as UserReset));
            createUserMock.mockImplementationOnce(async () => ({} as UserDto));
            await userService.signup(EMAIL);
            expect(sendCreationMailMock).toHaveBeenCalled();
        });

        it("should return an email", async () => {
            const expected = EMAIL;
            resetUserMock.mockImplementationOnce(async () => ({} as UserReset));
            createUserMock.mockImplementationOnce(async () => ({} as UserDto));
            const actual = await userService.signup(EMAIL);
            expect(actual).toEqual(expected);
        });
    });

    describe("login", () => {
        it("should throw an Error if user not found", async () => {
            getUserWithSecretsByEmailMock.mockImplementationOnce(async () => null);
            const expected = {
                message: "User not found",
                code: LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH,
            };
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

        it("should throw an Error if password do not match", async () => {
            bcryptCompareMock.mockImplementationOnce(async () => false);
            const expected = {
                message: "Password does not match",
                code: LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH,
            };
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

        it("should call userRepository.createUser", async () => {
            await userService.createConsumer(EMAIL);
            expect(createUserMock).toBeCalledTimes(1);
        });

        it("should not create consumer token if user creation failed", async () => {
            createUserMock.mockRejectedValueOnce(new Error());
            await userService.createConsumer(EMAIL).catch(() => {});
            expect(createUserMock).toBeCalledTimes(1);
        });

        it("should create a token ", async () => {
            const expected = CONSUMER_JWT_PAYLOAD;
            createUserMock.mockImplementationOnce(async () => USER_WITHOUT_SECRET);
            await userService.createConsumer(EMAIL);
            expect(buildJWTTokenMock).toHaveBeenCalledWith(expected, {
                expiration: false,
            });
        });

        it("should call consumerTokenRepository.create", async () => {
            await userService.createConsumer(EMAIL);
            expect(createTokenMock).toBeCalledTimes(1);
        });

        it("should delete user if token generation failed", async () => {
            createTokenMock.mockRejectedValueOnce(new Error());
            const id = USER_WITHOUT_SECRET._id.toString();
            await userService.createConsumer(EMAIL).catch(() => {});
            expect(deleteUserMock).toHaveBeenCalledWith(id);
        });

        it("should throw if token generation failed", async () => {
            createTokenMock.mockRejectedValueOnce(new Error());
            const test = () => userService.createConsumer(EMAIL);
            await expect(test).rejects.toMatchObject(
                new InternalServerError("Could not create consumer token", UserServiceErrors.CREATE_CONSUMER_TOKEN),
            );
        });

        it("should return UserDtoSuccessResponse", async () => {
            const expected = CONSUMER_USER;
            createTokenMock.mockImplementationOnce(async () => true);
            const actual = await userService.createConsumer(EMAIL);
            expect(actual).toEqual(expected);
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
            // @ts-expect-error: test
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
                expiresIn: JWT_EXPIRES_TIME,
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
        const repoMock = jest.spyOn(userRepository, "findByPeriod");
        const REPO_RETURN = {};
        const END = new Date();
        const BEGIN = new Date(END.getFullYear() - 1, END.getMonth(), END.getDay() + 1);
        const WITH_ADMIN = true;

        // @ts-expect-error mock
        beforeAll(() => repoMock.mockResolvedValue(REPO_RETURN));
        afterAll(() => repoMock.mockRestore());

        it("should call repo with given args", async () => {
            await userService.findByPeriod(BEGIN, END, WITH_ADMIN);
            expect(repoMock).toBeCalledWith(BEGIN, END, WITH_ADMIN);
        });

        it("should call repo with default", async () => {
            await userService.findByPeriod(BEGIN, END);
            expect(repoMock).toBeCalledWith(BEGIN, END, false);
        });

        it("should return repo's return value", async () => {
            const expected = REPO_RETURN;
            const actual = await userService.findByPeriod(BEGIN, END);
            expect(actual).toBe(expected);
        });
    });

    describe("countTotalUsersOnDate()", () => {
        const repoMock = jest.spyOn(userRepository, "countTotalUsersOnDate");
        const REPO_RETURN = 5;
        const DATE = new Date();
        const WITH_ADMIN = true;

        beforeAll(() => repoMock.mockResolvedValue(REPO_RETURN));
        afterAll(() => repoMock.mockRestore());

        it("should call repo with given args", async () => {
            await userService.countTotalUsersOnDate(DATE, WITH_ADMIN);
            expect(repoMock).toBeCalledWith(DATE, WITH_ADMIN);
        });

        it("should call repo with default", async () => {
            await userService.countTotalUsersOnDate(DATE);
            expect(repoMock).toBeCalledWith(DATE, false);
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
});

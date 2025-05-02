import { removeSecrets } from "../../../../shared/helpers/PortHelper";

const jwtVerifyMock = jest.fn();
const jwtSignMock = jest.fn(() => SIGNED_TOKEN);
jest.mock("jsonwebtoken", () => ({
    __esModule: true, // this property makes it work
    default: {
        verify: jwtVerifyMock,
        sign: jwtSignMock,
    },
}));

import userAuthService from "./user.auth.service";
import { LoginDtoErrorCodes, UserDto, UserErrorCodes } from "dto";
import { ObjectId } from "mongodb";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
const mockedBcrypt = jest.mocked(bcrypt);

import userPort from "../../../../dataProviders/db/user/user.port";

jest.mock("../../../../dataProviders/db/user/user.port");
const mockedUserPort = jest.mocked(userPort);
import {
    CONSUMER_USER,
    SIGNED_TOKEN,
    USER_DBO,
    USER_SECRETS,
    USER_WITHOUT_SECRET,
} from "../../__fixtures__/user.fixture";
import { BadRequestError, UnauthorizedError, LoginError } from "core";

jest.mock("../../../../dataProviders/db/user/user.port");
import * as portHelper from "../../../../shared/helpers/PortHelper";

jest.mock("../../../../shared/helpers/PortHelper", () => ({
    removeSecrets: jest.fn(user => user),
    uniformizeId: jest.fn(token => token),
}));
import userCheckService, { UserCheckService } from "../check/user.check.service";
import UserReset from "../../entities/UserReset";

jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userCrudService from "../crud/user.crud.service";

jest.mock("../crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);
import { NotificationType } from "../../../notify/@types/NotificationType";
import notifyService from "../../../notify/notify.service";
import UserDbo from "../../../../dataProviders/db/user/UserDbo";

jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);
import userActivationService from "../activation/user.activation.service";
import { UserServiceErrors } from "../../user.enum";

jest.mock("../activation/user.activation.service");
const mockedUserActivationService = jest.mocked(userActivationService);

describe("user auth service", () => {
    const USER_ID = new ObjectId();
    const PASSWORD = "PAssWoRD135!&";

    describe("getHashPassword", () => {
        it("should call bcrypt.hash", async () => {
            await userAuthService.getHashPassword(PASSWORD);
            expect(bcrypt.hash).toHaveBeenCalledWith(PASSWORD, 10);
        });
    });

    describe("findJwtByUser", () => {
        it("should call userPort", async () => {
            await userAuthService.findJwtByUser({ _id: USER_ID } as UserDto);
            expect(userPort.getUserWithSecretsById).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe("buildJWTToken", () => {
        it("should remove jwt if given", () => {
            jest.mocked(removeSecrets).mockReturnValueOnce(USER_WITHOUT_SECRET);
            // @ts-expect-error mock
            userAuthService.buildJWTToken({ ...USER_WITHOUT_SECRET, jwt: "smthg" }, { expiration: true });
            expect(jwt.sign).toHaveBeenCalledWith(
                { ...USER_WITHOUT_SECRET, now: expect.any(Date) },
                expect.anything(),
                expect.anything(),
            );
        });

        it("should set expiresIn", () => {
            const expected = {
                expiresIn: JWT_EXPIRES_TIME,
            };
            userAuthService.buildJWTToken(USER_WITHOUT_SECRET, { expiration: true });
            expect(jwt.sign).toHaveBeenCalledWith(
                { ...USER_WITHOUT_SECRET, now: expect.any(Date) },
                expect.any(String),
                expected,
            );
        });

        it("should not set expiresIn", () => {
            const expected = {};
            userAuthService.buildJWTToken(USER_WITHOUT_SECRET, { expiration: false });
            expect(jwt.sign).toHaveBeenCalledWith(
                { ...USER_WITHOUT_SECRET, now: expect.any(Date) },
                expect.any(String),
                expected,
            );
        });
    });

    describe("updatePassword", () => {
        const PASSWORD = "12345&#Data";
        const mockGetHashPassword = jest.spyOn(userAuthService, "getHashPassword");

        beforeAll(() => mockGetHashPassword.mockImplementation(async PASSWORD => PASSWORD));
        afterAll(() => mockGetHashPassword.mockRestore());

        it("should reject because password not valid", async () => {
            mockedUserCheckService.passwordValidator.mockReturnValue(false);
            expect(userAuthService.updatePassword(USER_WITHOUT_SECRET, PASSWORD)).rejects.toEqual(
                new BadRequestError(UserCheckService.PASSWORD_VALIDATOR_MESSAGE, UserErrorCodes.INVALID_PASSWORD),
            );
        });

        it("should update user", async () => {
            mockedUserCheckService.passwordValidator.mockReturnValue(true);
            await userAuthService.updatePassword(USER_WITHOUT_SECRET, PASSWORD);
            expect(userPort.update).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                hashPassword: PASSWORD,
            });
        });
    });

    describe("updateJwt", () => {
        const mockBuildJWTToken = jest.spyOn(userAuthService, "buildJWTToken");

        it("should generate new token and update user", async () => {
            mockedUserPort.update.mockResolvedValueOnce(JSON.parse(JSON.stringify(USER_DBO)));
            // minus two days
            const oldDate = new Date(Date.now() - 172800001);
            jwtVerifyMock.mockImplementation(() => ({
                token: "TOKEN",
                now: oldDate,
            }));
            await userAuthService.updateJwt(USER_DBO);
            expect(mockBuildJWTToken).toHaveBeenCalledTimes(1);
            expect(userPort.update).toHaveBeenCalledTimes(1);
        });

        it("should return user", async () => {
            // @ts-expect-error test mock
            mockedUserPort.update.mockResolvedValueOnce("USER WITH JWT");
            const expected = "USER WITH JWT";
            const actual = await userAuthService.updateJwt(USER_DBO);
            expect(actual).toEqual(expected);
        });
    });

    describe("logout", () => {
        beforeAll(() =>
            mockedUserPort.getUserWithSecretsByEmail.mockImplementation(async () => ({
                ...USER_WITHOUT_SECRET,
                jwt: { token: "", expirateDate: new Date() },
                hashPassword: "",
            })),
        );

        afterAll(() => mockedUserPort.getUserWithSecretsByEmail.mockReset());

        it("should call userPort.getUserWithSecretsByEmail()", async () => {
            await userAuthService.logout(USER_WITHOUT_SECRET);
            expect(mockedUserPort.getUserWithSecretsByEmail).toHaveBeenCalledTimes(1);
        });

        it("should call userPort.update()", async () => {
            await userAuthService.logout(USER_WITHOUT_SECRET);
            expect(mockedUserPort.update).toHaveBeenCalledTimes(1);
        });
    });

    describe("login", () => {
        const mockUpdateJwt = jest.spyOn(userAuthService, "updateJwt");

        beforeEach(() => {
            mockedBcrypt.compare.mockImplementation(() => true);
            // @ts-expect-error: test mock
            mockUpdateJwt.mockResolvedValue("USER WITH JWT");
            mockedUserPort.getUserWithSecretsByEmail.mockImplementation(async () => USER_DBO);
        });

        afterEach(() => {
            mockUpdateJwt.mockReset();
            mockedUserPort.getUserWithSecretsByEmail.mockReset();
        });

        it("should throw an Error if user not found", async () => {
            mockedUserPort.getUserWithSecretsByEmail.mockImplementationOnce(async () => null);
            const expected = new LoginError();
            const test = async () => await userAuthService.login(USER_DBO.email, "PASSWORD");
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should throw UnauthorizedError if user does not have a password set", async () => {
            mockedUserPort.getUserWithSecretsByEmail.mockImplementationOnce(async () => ({
                ...USER_DBO,
                hashPassword: undefined,
            }));
            const expected = new UnauthorizedError(
                "User has not set a password so they can't login this way",
                LoginDtoErrorCodes.PASSWORD_UNSET,
            );
            const test = async () => await userAuthService.login(USER_DBO.email, "PASSWORD");
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should throw an Error if user is not active", async () => {
            mockedUserPort.getUserWithSecretsByEmail.mockImplementationOnce(async () => ({
                ...USER_DBO,
                active: false,
            }));
            const expected = {
                message: "User is not active",
                code: LoginDtoErrorCodes.USER_NOT_ACTIVE,
            };
            const test = async () => await userAuthService.login(USER_DBO.email, "PASSWORD");
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should throw LoginError password do not match", async () => {
            jest.mocked(bcrypt.compare).mockImplementationOnce(async () => false);
            const expected = new LoginError();
            const test = async () => await userAuthService.login(USER_DBO.email, "PASSWORD");
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return user", async () => {
            const expected = "USER WITH JWT";
            const actual = await userAuthService.login(USER_DBO.email, "PASSWORD");
            expect(actual).toEqual(expected);
        });

        it("should notify USER_LOGGED", async () => {
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({}) as UserReset);
            mockedUserCrudService.createUser.mockImplementationOnce(async () => ({}) as UserDto);
            await userAuthService.login(USER_DBO.email, "PASSWORD");
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_LOGGED, {
                email: USER_DBO.email,
                date: expect.any(Date),
            });
        });
    });

    describe("authenticate", () => {
        const DECODED_TOKEN = { ...USER_WITHOUT_SECRET, now: (d => new Date(d.setDate(d.getDate() + 1)))(new Date()) };
        it("should throw error if user does not exist", async () => {
            mockedUserPort.getUserWithSecretsByEmail.mockImplementationOnce(jest.fn());
            const expected = { message: "User not found", code: UserServiceErrors.USER_NOT_FOUND };
            const test = async () => await userAuthService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should call removeSecrets() when consumer", async () => {
            mockedUserPort.getUserWithSecretsByEmail.mockImplementationOnce(
                async () => ({ ...CONSUMER_USER, ...USER_SECRETS }) as UserDbo,
            );
            await userAuthService.authenticate({ ...DECODED_TOKEN, ...CONSUMER_USER }, USER_SECRETS.jwt.token);
            expect(portHelper.removeSecrets).toBeCalledTimes(1);
        });

        it("should call removeSecrets() when user", async () => {
            mockedUserPort.getUserWithSecretsByEmail.mockImplementationOnce(async () => USER_DBO);
            await userAuthService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            expect(portHelper.removeSecrets).toBeCalledTimes(1);
        });

        it("should return UserServiceError if user not active", async () => {
            mockedUserPort.getUserWithSecretsByEmail.mockImplementationOnce(async () => ({
                ...USER_DBO,
                active: false,
            }));
            const expected = { message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE };
            const test = async () => await userAuthService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return UserServiceError if token has expired", async () => {
            mockedUserPort.getUserWithSecretsByEmail.mockImplementationOnce(async () => USER_DBO);
            const expected = {
                message: "JWT has expired, please login try again",
                code: UserServiceErrors.LOGIN_UPDATE_JWT_FAIL,
            };
            const test = () =>
                userAuthService.authenticate(
                    {
                        ...DECODED_TOKEN,
                        now: (d => new Date(d.setDate(d.getDate() - 3)))(new Date()),
                    },
                    USER_SECRETS.jwt.token,
                );
            await expect(test).rejects.toMatchObject(expected);
        });
    });
});

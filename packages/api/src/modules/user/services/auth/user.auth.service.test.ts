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
jest.mock("bcrypt");
const mockedBcrypt = jest.mocked(bcrypt);
import jwt from "jsonwebtoken";

import userRepository from "../../repositories/user.repository";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
import {
    CONSUMER_USER,
    SIGNED_TOKEN,
    USER_DBO,
    USER_SECRETS,
    USER_WITHOUT_SECRET,
} from "../../__fixtures__/user.fixture";
import { BadRequestError } from "../../../../shared/errors/httpErrors";
jest.mock("../../repositories/user.repository");
import * as repositoryHelper from "../../../../shared/helpers/RepositoryHelper";
jest.mock("../../../../shared/helpers/RepositoryHelper", () => ({
    removeSecrets: jest.fn(user => user),
    uniformizeId: jest.fn(token => token),
}));
import userCheckService, { UserCheckService } from "../check/user.check.service";
import LoginError from "../../../../shared/errors/LoginError";
import UserReset from "../../entities/UserReset";
jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userService, { UserServiceErrors } from "../../user.service";
jest.mock("../../user.service");
const mockedUserService = jest.mocked(userService);
import { NotificationType } from "../../../notify/@types/NotificationType";
import notifyService from "../../../notify/notify.service";
import UserDbo from "../../repositories/dbo/UserDbo";
jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);

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
        it("should call userRepository", async () => {
            await userAuthService.findJwtByUser({ _id: USER_ID } as UserDto);
            expect(userRepository.getUserWithSecretsById).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe("buildJWTToken", () => {
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
        // @ts
        // console.log(userAuthService);
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
            expect(userRepository.update).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                hashPassword: PASSWORD,
            });
        });
    });

    describe("updateJwt", () => {
        const mockBuildJWTToken = jest.spyOn(userAuthService, "buildJWTToken");

        it("should generate new token and update user", async () => {
            mockedUserRepository.update.mockResolvedValueOnce(JSON.parse(JSON.stringify(USER_DBO)));
            // minus two days
            const oldDate = new Date(Date.now() - 172800001);
            jwtVerifyMock.mockImplementation(() => ({
                token: "TOKEN",
                now: oldDate,
            }));
            await userAuthService.updateJwt(USER_DBO);
            expect(mockBuildJWTToken).toHaveBeenCalledTimes(1);
            expect(userRepository.update).toHaveBeenCalledTimes(1);
        });

        it("should return user", async () => {
            // @ts-expect-error test mock
            mockedUserRepository.update.mockResolvedValueOnce("USER WITH JWT");
            const expected = "USER WITH JWT";
            const actual = await userAuthService.updateJwt(USER_DBO);
            expect(actual).toEqual(expected);
        });
    });

    describe("logout", () => {
        beforeAll(() =>
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementation(async () => ({
                ...USER_WITHOUT_SECRET,
                jwt: { token: "", expirateDate: new Date() },
                hashPassword: "",
            })),
        );

        afterAll(() => mockedUserRepository.getUserWithSecretsByEmail.mockReset());

        it("should call userRepository.getUserWithSecretsByEmail()", async () => {
            await userAuthService.logout(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.getUserWithSecretsByEmail).toHaveBeenCalledTimes(1);
        });

        it("should call userRepository.update()", async () => {
            await userAuthService.logout(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
        });
    });

    describe("login", () => {
        const mockUpdateJwt = jest.spyOn(userAuthService, "updateJwt");

        beforeEach(() => {
            mockedBcrypt.compare.mockImplementation(() => true);
            // @ts-expect-error: test mock
            mockUpdateJwt.mockResolvedValue("USER WITH JWT");
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementation(async () => USER_DBO);
        });

        afterEach(() => {
            mockUpdateJwt.mockReset();
            mockedUserRepository.getUserWithSecretsByEmail.mockReset();
        });

        it("should throw an Error if user not found", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(async () => null);
            const expected = new LoginError();
            const test = async () => await userAuthService.login(USER_DBO.email, "PASSWORD");
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
            mockedUserService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockedUserService.createUser.mockImplementationOnce(async () => ({} as UserDto));
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
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(jest.fn());
            const expected = { message: "User not found", code: UserServiceErrors.USER_NOT_FOUND };
            const test = async () => await userAuthService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should call removeSecrets() when consumer", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(
                async () => ({ ...CONSUMER_USER, ...USER_SECRETS } as UserDbo),
            );
            await userAuthService.authenticate({ ...DECODED_TOKEN, ...CONSUMER_USER }, USER_SECRETS.jwt.token);
            expect(repositoryHelper.removeSecrets).toBeCalledTimes(1);
        });

        it("should call removeSecrets() when user", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(async () => USER_DBO);
            await userAuthService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            expect(repositoryHelper.removeSecrets).toBeCalledTimes(1);
        });

        it("should return UserServiceError if user not active", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(async () => ({
                ...USER_DBO,
                active: false,
            }));
            const expected = { message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE };
            const test = async () => await userAuthService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return UserServiceError if token has expired", async () => {
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementationOnce(async () => USER_DBO);
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

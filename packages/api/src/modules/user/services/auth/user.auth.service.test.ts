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
import { LoginDtoErrorCodes } from "dto";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
const mockedBcrypt = jest.mocked(bcrypt);

import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";

jest.mock("../../../../adapters/outputs/db/user/user.adapter");
const mockedUserAdapter = jest.mocked(userAdapter);
import { SIGNED_TOKEN, USER_ENTITY, USER_SECRETS, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError, LoginError } from "core";

jest.mock("../../../../adapters/outputs/db/user/user.adapter");

import userCheckService, { UserCheckService } from "../check/user.check.service";
import UserReset from "../../entities/UserReset";

jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userCrudService from "../crud/user.crud.service";

jest.mock("../crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);
import { NotificationType } from "../../../notify/@types/NotificationType";
import notifyService from "../../../notify/notify.service";

jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);
import userActivationService from "../activation/user.activation.service";
import { UserServiceErrors } from "../../user.enum";
import UserEntity from "../../../../domain/users/UserEntity";

jest.mock("../activation/user.activation.service");
const mockedUserActivationService = jest.mocked(userActivationService);

describe("user auth service", () => {
    const PASSWORD = "PAssWoRD135!&";

    beforeEach(() => {
        jest.spyOn(userAdapter, "getUserWithSecretsById").mockResolvedValue(USER_ENTITY);
    });

    describe("getHashPassword", () => {
        it("should call bcrypt.hash", async () => {
            await userAuthService.getHashPassword(PASSWORD);
            expect(bcrypt.hash).toHaveBeenCalledWith(PASSWORD, 10);
        });
    });

    describe("buildJWTToken", () => {
        it("should remove jwt if given", () => {
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
                new BadRequestError(UserCheckService.PASSWORD_VALIDATOR_MESSAGE),
            );
        });

        it("should update user", async () => {
            mockedUserCheckService.passwordValidator.mockReturnValue(true);
            await userAuthService.updatePassword(USER_WITHOUT_SECRET, PASSWORD);
            expect(userAdapter.update).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                hashPassword: PASSWORD,
            });
        });
    });

    describe("updateJwt", () => {
        const mockBuildJWTToken = jest.spyOn(userAuthService, "buildJWTToken");

        it("should generate new token and update user", async () => {
            mockedUserAdapter.update.mockResolvedValueOnce(JSON.parse(JSON.stringify(USER_WITHOUT_SECRET)));
            // minus two days
            const oldDate = new Date(Date.now() - 172800001);
            jwtVerifyMock.mockImplementation(() => ({
                token: "TOKEN",
                now: oldDate,
            }));
            await userAuthService.updateJwt(USER_WITHOUT_SECRET);
            expect(mockBuildJWTToken).toHaveBeenCalledTimes(1);
        });

        it("should return user", async () => {
            // @ts-expect-error test mock
            mockedUserAdapter.update.mockResolvedValueOnce("USER WITH JWT");
            const expected = "USER WITH JWT";
            const actual = await userAuthService.updateJwt(USER_WITHOUT_SECRET);
            expect(actual).toEqual(expected);
        });
    });

    describe("logout", () => {
        beforeAll(() =>
            mockedUserAdapter.getUserWithSecretsByEmail.mockImplementation(
                async () =>
                    ({
                        ...USER_WITHOUT_SECRET,
                        jwt: { token: "", expirateDate: new Date() },
                        hashPassword: "",
                    }) as UserEntity,
            ),
        );

        afterAll(() => mockedUserAdapter.getUserWithSecretsByEmail.mockReset());

        it("should call userAdapter.getUserWithSecretsByEmail()", async () => {
            await userAuthService.logout(USER_WITHOUT_SECRET);
            expect(mockedUserAdapter.getUserWithSecretsByEmail).toHaveBeenCalledTimes(1);
        });

        it("should call userAdapter.update()", async () => {
            await userAuthService.logout(USER_WITHOUT_SECRET);
            expect(mockedUserAdapter.update).toHaveBeenCalledTimes(1);
        });
    });

    describe("login", () => {
        const mockUpdateJwt = jest.spyOn(userAuthService, "updateJwt");

        beforeEach(() => {
            mockedBcrypt.compare.mockImplementation(() => true);
            mockUpdateJwt.mockResolvedValue(USER_ENTITY);
            mockedUserAdapter.getUserWithSecretsByEmail.mockResolvedValue(USER_ENTITY);
        });

        it("should throw a LoginError if user not found", async () => {
            mockedUserAdapter.getUserWithSecretsByEmail.mockResolvedValueOnce(null);
            const expected = new LoginError();
            await expect(async () =>
                userAuthService.login(USER_WITHOUT_SECRET.email, "PASSWORD"),
            ).rejects.toMatchObject(expected);
        });

        it("should throw UnauthorizedError if user does not have a password set", async () => {
            mockedUserAdapter.getUserWithSecretsByEmail.mockResolvedValueOnce(
                new UserEntity({
                    ...USER_WITHOUT_SECRET,
                    hashPassword: undefined,
                }),
            );
            const expected = new UnauthorizedError(
                "User has not set a password so they can't login this way",
                LoginDtoErrorCodes.PASSWORD_UNSET,
            );

            try {
                await userAuthService.login(USER_WITHOUT_SECRET.email, "PASSWORD");
            } catch (e) {
                expect(e).toEqual(expected);
            }
        });

        it("should throw an UnauthorizedError if user is not active", async () => {
            mockedUserAdapter.getUserWithSecretsByEmail.mockResolvedValueOnce(
                new UserEntity({
                    ...USER_ENTITY,
                    active: false,
                }),
            );
            const expected = {
                message: "User is not active",
                code: LoginDtoErrorCodes.USER_NOT_ACTIVE,
            };
            await expect(async () =>
                userAuthService.login(USER_WITHOUT_SECRET.email, "PASSWORD"),
            ).rejects.toMatchObject(expected);
        });

        it("should throw LoginError password do not match", async () => {
            jest.mocked(bcrypt.compare).mockImplementationOnce(async () => false);
            const expected = new LoginError();
            const test = async () => await userAuthService.login(USER_WITHOUT_SECRET.email, "PASSWORD");
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return user", async () => {
            const expected = USER_ENTITY;
            const actual = await userAuthService.login(USER_WITHOUT_SECRET.email, "PASSWORD");
            expect(actual).toEqual(expected);
        });

        it("should notify USER_LOGGED", async () => {
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({}) as UserReset);
            mockedUserCrudService.createUser.mockImplementationOnce(async () => ({}) as UserEntity);
            await userAuthService.login(USER_WITHOUT_SECRET.email, "PASSWORD");
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_LOGGED, {
                email: USER_WITHOUT_SECRET.email,
                date: expect.any(Date),
            });
        });
    });

    describe("authenticate", () => {
        const DECODED_TOKEN = { ...USER_WITHOUT_SECRET, now: (d => new Date(d.setDate(d.getDate() + 1)))(new Date()) };
        it("should throw error if user does not exist", async () => {
            mockedUserAdapter.getUserWithSecretsByEmail.mockImplementationOnce(jest.fn());
            const expected = new NotFoundError("User not found");
            const test = async () => await userAuthService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return UserServiceError if user not active", async () => {
            mockedUserAdapter.getUserWithSecretsByEmail.mockImplementationOnce(
                async () =>
                    ({
                        ...USER_WITHOUT_SECRET,
                        active: false,
                    }) as UserEntity,
            );
            const expected = new ForbiddenError("User is not active");
            const test = async () => await userAuthService.authenticate(DECODED_TOKEN, USER_SECRETS.jwt.token);
            await expect(test).rejects.toMatchObject(expected);
        });

        it("should return UserServiceError if token has expired", async () => {
            mockedUserAdapter.getUserWithSecretsByEmail.mockImplementationOnce(async () => USER_WITHOUT_SECRET);
            const expected = new UnauthorizedError("JWT has expired, please login try again");
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

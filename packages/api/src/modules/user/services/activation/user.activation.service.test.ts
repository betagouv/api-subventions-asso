import userActivationService, { UserActivationService } from "./user.activation.service";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import { USER_ENTITY, USER_SECRETS, USER_WITHOUT_PASSWORD, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import { BadRequestError, GoneError, InternalServerError, ResetTokenNotFoundError, UserNotFoundError } from "core";
import { TokenValidationDtoPositiveResponse, TokenValidationType } from "dto";

jest.mock("../../../../adapters/outputs/db/user/user.adapter");
const mockedUserAdapter = jest.mocked(userAdapter);
import userResetAdapter from "../../../../adapters/outputs/db/user/user-reset.adapter";

jest.mock("../../../../adapters/outputs/db/user/user-reset.adapter");
const mockedUserResetAdapter = jest.mocked(userResetAdapter);
import userCheckService, { UserCheckService } from "../check/user.check.service";

jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userAuthService from "../auth/user.auth.service";

jest.mock("../auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService);
import userCrudService from "../crud/user.crud.service";

jest.mock("../crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);
import notifyService from "../../../notify/notify.service";
import { DEFAULT_PASSWORD, USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { NotificationType } from "../../../notify/@types/NotificationType";

jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);
import { UserServiceErrors } from "../../user.enum";
import UserEntity from "../../../../domain/users/UserEntity";
import { USER_RESET_ENTITY } from "../../__fixtures__/user-reset.fixture";

jest.mock("rand-token", () => ({
    generate: () => "RAND_TOKEN",
}));

jest.useFakeTimers().setSystemTime(new Date("2023-01-01"));

describe("user activation service", () => {
    describe("refreshExpirationToken", () => {
        beforeEach(() => {
            mockedUserAdapter.getUserWithSecretsByEmail.mockResolvedValue(USER_ENTITY);
            mockedUserAdapter.update.mockResolvedValue(USER_ENTITY);
        });

        afterAll(() => mockedUserAdapter.getUserWithSecretsByEmail.mockReset());

        it("should call userAdapter.getUserWithSecretsByEmail", async () => {
            await userActivationService.refreshExpirationToken(USER_ENTITY);
            expect(mockedUserAdapter.getUserWithSecretsByEmail).toHaveBeenCalledTimes(1);
        });

        it("should return an error object if no user found", async () => {
            const expected = {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
            mockedUserAdapter.getUserWithSecretsByEmail.mockResolvedValueOnce(null);
            const actual = await userActivationService.refreshExpirationToken(USER_ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return an error object if user found without jwt", async () => {
            const expected = {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
            mockedUserAdapter.getUserWithSecretsByEmail.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            const actual = await userActivationService.refreshExpirationToken(USER_ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should call userAdapter.update()", async () => {
            await userActivationService.refreshExpirationToken(USER_ENTITY);
            expect(mockedUserAdapter.update).toHaveBeenCalledWith(USER_ENTITY);
        });

        it("should set jwt.expirateDate", async () => {
            await userActivationService.refreshExpirationToken(USER_ENTITY);
            expect(mockedUserAdapter.update).toHaveBeenCalledWith({
                ...USER_ENTITY,
                jwt: { token: USER_SECRETS.jwt.token, expirateDate: new Date(Date.now() + JWT_EXPIRES_TIME) },
            });
        });
    });

    describe("isResetExpired", () => {
        it("should return true", () => {
            const EXPIRED_DATE = new Date(Date.now() - UserActivationService.RESET_TIMEOUT - 1);
            const actual = userActivationService.isResetExpired({
                ...USER_RESET_ENTITY,
                createdAt: EXPIRED_DATE,
            });
            expect(actual).toBeTruthy();
        });

        it("should return false", () => {
            const actual = userActivationService.isResetExpired({ ...USER_RESET_ENTITY, createdAt: new Date() });
            expect(actual).toBeFalsy();
        });
    });

    describe("validateResetToken", () => {
        let mockisResetExpired: jest.SpyInstance;

        beforeAll(() => {
            mockisResetExpired = jest.spyOn(userActivationService, "isResetExpired");
            mockisResetExpired.mockReturnValue(false);
        });

        it("should return ResetTokenNotFoundError if token is null", () => {
            const expected = { valid: false, error: new ResetTokenNotFoundError() };
            const actual = userActivationService.validateResetToken(null);
            expect(actual).toEqual(expected);
        });

        it("should return BadRequestError if token has expired", () => {
            mockisResetExpired.mockReturnValueOnce(true);
            const expected = {
                valid: false,
                error: new GoneError("Reset token has expired, please retry forget password"),
            };
            const actual = userActivationService.validateResetToken(USER_RESET_ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return valid", () => {
            const expected = true;
            const actual = userActivationService.validateResetToken(USER_RESET_ENTITY).valid;
            expect(actual).toEqual(expected);
        });
    });

    describe("validateTokenAndGetType", () => {
        const FAKE_TOKEN = "FAKE";

        const user = {
            profileToComplete: true,
        } as unknown as UserEntity;

        let mockValidateResetToken: jest.SpyInstance;

        beforeAll(() => {
            mockValidateResetToken = jest.spyOn(userActivationService, "validateResetToken");
            mockValidateResetToken.mockImplementation(() => ({ valid: true }));
            mockedUserResetAdapter.findByToken.mockResolvedValue(USER_RESET_ENTITY);
            mockedUserCrudService.getUserById.mockResolvedValue(user);
        });

        afterAll(() => {
            mockedUserResetAdapter.findByToken.mockReset();
            mockValidateResetToken.mockRestore();
            mockedUserCrudService.getUserById.mockReset();
        });

        it("should call find by token", async () => {
            await userActivationService.validateTokenAndGetType(FAKE_TOKEN);
            expect(mockedUserResetAdapter.findByToken).toHaveBeenCalledWith(FAKE_TOKEN);
        });

        it("should return true", async () => {
            const actual = await userActivationService.validateTokenAndGetType(FAKE_TOKEN);
            expect(actual.valid).toBeTruthy();
        });

        it("should call validateResetToken", async () => {
            await userActivationService.validateTokenAndGetType(FAKE_TOKEN);

            expect(mockValidateResetToken).toHaveBeenCalledWith(USER_RESET_ENTITY);
        });

        it("should return type is SIGNUP", async () => {
            //@ts-expect-error: mock
            mockedUserResetAdapter.findByToken.mockResolvedValueOnce({
                createdAt: new Date(),
            });
            const actual = (await userActivationService.validateTokenAndGetType(
                FAKE_TOKEN,
            )) as TokenValidationDtoPositiveResponse;

            expect(actual.type).toBe(TokenValidationType.SIGNUP);
        });

        it("should return type is FORGET_PASSWORD", async () => {
            // @ts-expect-error: mock
            mockedUserResetAdapter.findByToken.mockResolvedValueOnce({
                createdAt: new Date(),
            });

            // @ts-expect-error: mock
            mockedUserCrudService.getUserById.mockResolvedValueOnce({
                profileToComplete: false,
            });

            const actual = (await userActivationService.validateTokenAndGetType(
                FAKE_TOKEN,
            )) as TokenValidationDtoPositiveResponse;

            expect(actual.type).toBe(TokenValidationType.FORGET_PASSWORD);
        });
    });

    describe("resetPassword", () => {
        const PASSWORD = "12345&#Data";
        const RESET_TOKEN = "azeazdazçè!è78789dqzdqDqzd";

        let mockValidateResetToken: jest.SpyInstance;

        beforeAll(() => {
            mockValidateResetToken = jest.spyOn(userActivationService, "validateResetToken");
            mockValidateResetToken.mockImplementation(() => ({ valid: true }));
        });

        beforeEach(() => {
            mockedUserResetAdapter.findByToken.mockResolvedValue(USER_RESET_ENTITY);
            mockedUserCrudService.getUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserAdapter.update.mockResolvedValue(USER_WITHOUT_PASSWORD);
            mockedUserCheckService.passwordValidator.mockReturnValue(true);
            mockedUserAuthService.updateJwt.mockImplementation(
                jest.fn(user => Promise.resolve(new UserEntity({ ...user, jwt: USER_SECRETS.jwt }))),
            );
        });

        afterAll(() => {
            mockedUserResetAdapter.findByToken.mockReset();
            mockedUserCrudService.getUserById.mockReset();
            mockedUserCheckService.passwordValidator.mockReset();
            mockedUserAdapter.update.mockReset();
            mockedUserAuthService.updateJwt.mockReset();
        });

        it("should call validateResetToken()", async () => {
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockValidateResetToken).toHaveBeenCalledTimes(1);
        });

        it("should reject because user not found", async () => {
            mockedUserCrudService.getUserById.mockResolvedValueOnce(null);
            expect(userActivationService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(new UserNotFoundError());
        });

        it("should reject because password not valid", async () => {
            mockedUserCheckService.passwordValidator.mockReturnValueOnce(false);
            expect(userActivationService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(
                new BadRequestError(UserCheckService.PASSWORD_VALIDATOR_MESSAGE),
            );
        });

        it("should remove resetUser", async () => {
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedUserResetAdapter.remove).toHaveBeenCalledWith(USER_RESET_ENTITY);
        });

        it("should notify USER_LOGGED", async () => {
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_LOGGED, {
                email: USER_EMAIL,
                date: expect.any(Date),
            });
        });

        it("should notify USER_ACTIVATED", async () => {
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_ACTIVATED, {
                email: USER_EMAIL,
            });
        });

        it("should update user", async () => {
            mockedUserAuthService.getHashPassword.mockResolvedValueOnce(PASSWORD);
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedUserAdapter.update).toHaveBeenCalledWith(
                {
                    ...USER_WITHOUT_SECRET,
                    hashPassword: PASSWORD,
                    active: true,
                    lastActivityDate: expect.any(Date),
                },
                true,
            );
        });

        it("update user's jwt", async () => {
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedUserAuthService.updateJwt).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                jwt: USER_SECRETS.jwt,
            });
        });

        it("returns user with jwt", async () => {
            const expected = {
                ...USER_WITHOUT_SECRET,
                jwt: USER_SECRETS.jwt,
            };
            const actual = await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(actual).toEqual(expected);
        });
    });

    describe("setsPasswordAndActivate", () => {
        const HASH = "1094@¹#{@";

        beforeAll(() => {
            jest.mocked(userAuthService.getHashPassword).mockResolvedValue(HASH);
        });
        afterAll(() => {
            jest.mocked(userAuthService.getHashPassword).mockRestore();
        });

        it("hashes given password", async () => {
            await userActivationService.setsPasswordAndActivate(USER_WITHOUT_SECRET, DEFAULT_PASSWORD);
            expect(userAuthService.getHashPassword).toHaveBeenCalledWith(DEFAULT_PASSWORD);
        });

        it("updates user with activation and hashed password", async () => {
            await userActivationService.setsPasswordAndActivate(USER_WITHOUT_SECRET, DEFAULT_PASSWORD);
            expect(userAdapter.update).toHaveBeenCalledWith({ ...USER_WITHOUT_SECRET, hashPassword: HASH });
        });
    });

    describe("buildResetPwdUrl", () => {
        it("returns expected url", () => {
            const TOKEN = "toto";
            const actual = userActivationService.buildResetPwdUrl(TOKEN);
            expect(actual).toMatchInlineSnapshot(`"http://localhost:5173/auth/reset-password/toto"`);
        });
    });

    describe("forgetPassword", () => {
        const TOKEN = "MyTOK3N&64qzd4qs5d4z";
        const URL = "URL";
        let mockResetUser: jest.SpyInstance;
        let mockBuildUrl: jest.SpyInstance;
        beforeEach(() => {
            mockedUserAdapter.findByEmail.mockResolvedValue(USER_WITHOUT_SECRET);
            mockResetUser = jest.spyOn(userActivationService, "resetUser").mockResolvedValue({
                userId: USER_WITHOUT_SECRET.id,
                token: TOKEN,
                createdAt: new Date(),
            });
            mockBuildUrl = jest.spyOn(userActivationService, "buildResetPwdUrl").mockReturnValue(URL);
        });

        afterAll(() => mockResetUser.mockRestore());

        it("should call userAdapter.findByEmail()", async () => {
            await userActivationService.forgetPassword(USER_EMAIL);
            expect(mockedUserAdapter.findByEmail).toHaveBeenCalledWith(USER_EMAIL);
        });

        it("should return undefined if user not found", async () => {
            mockedUserAdapter.findByEmail.mockImplementation().mockRejectedValue(new UserNotFoundError());
            const expected = undefined;
            const actual = await userActivationService.forgetPassword(USER_EMAIL);
            expect(actual).toEqual(expected);
        });

        it("should call resetUser()", async () => {
            await userActivationService.forgetPassword(USER_EMAIL);
            expect(mockResetUser).toHaveBeenCalledWith(USER_WITHOUT_SECRET);
        });

        it("builds reset password", async () => {
            await userActivationService.forgetPassword(USER_EMAIL);
            expect(mockBuildUrl).toHaveBeenCalledWith(TOKEN);
        });

        it("should call notifyService.notify()", async () => {
            await userActivationService.forgetPassword(USER_EMAIL);
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_FORGET_PASSWORD, {
                email: USER_EMAIL.toLocaleLowerCase(),
                url: URL,
            });
        });
    });

    describe("resetUser", () => {
        beforeAll(() => {
            mockedUserResetAdapter.create.mockResolvedValue(USER_RESET_ENTITY);
        });

        afterAll(() => {
            mockedUserResetAdapter.create.mockReset();
        });

        it("should call userResetAdapter.removeAllByUserId()", async () => {
            await userActivationService.resetUser(USER_WITHOUT_SECRET);
            expect(mockedUserResetAdapter.removeAllByUserId).toHaveBeenCalledTimes(1);
        });

        it("should throw an error if reset token generation failed", async () => {
            // @ts-expect-error: test edge case
            mockedUserResetAdapter.create.mockResolvedValueOnce(null);
            expect(() => userActivationService.resetUser(USER_WITHOUT_SECRET)).rejects.toThrow(
                new InternalServerError(
                    "The user reset password could not be created",
                    UserServiceErrors.CREATE_RESET_PASSWORD_WRONG,
                ),
            );
        });

        it("should call userAdapter.update()", async () => {
            await userActivationService.resetUser(USER_WITHOUT_SECRET);
            expect(mockedUserAdapter.update).toHaveBeenCalledTimes(1);
        });

        it("should deactivate user", async () => {
            await userActivationService.resetUser(USER_WITHOUT_SECRET);
            expect(mockedUserAdapter.update).toHaveBeenCalledWith({ ...USER_WITHOUT_SECRET, active: false });
        });

        it("should return created UserReset", async () => {
            const expected = USER_RESET_ENTITY;
            const actual = await userActivationService.resetUser(USER_WITHOUT_SECRET);
            expect(actual).toEqual(expected);
        });
    });
});

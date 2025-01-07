import userActivationService from "./user.activation.service";
import userPort from "../../../../dataProviders/db/user/user.port";
import { USER_DBO, USER_SECRETS, USER_WITHOUT_PASSWORD, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import UserReset from "../../entities/UserReset";
import { ObjectId, WithId } from "mongodb";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
    ResetTokenNotFoundError,
} from "../../../../shared/errors/httpErrors";
import { ResetPasswordErrorCodes, TokenValidationDtoPositiveResponse, TokenValidationType, UserDto } from "dto";

jest.mock("../../../../dataProviders/db/user/user.port");
const mockedUserPort = jest.mocked(userPort);
import userResetPort from "../../../../dataProviders/db/user/user-reset.port";

jest.mock("../../../../dataProviders/db/user/user-reset.port");
const mockedUserResetPort = jest.mocked(userResetPort);
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
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { NotificationType } from "../../../notify/@types/NotificationType";

jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);
import RandToken from "rand-token";
import { UserServiceErrors } from "../../user.enum";

jest.mock("rand-token", () => ({
    generate: () => "RAND_TOKEN",
}));

jest.useFakeTimers().setSystemTime(new Date("2023-01-01"));

describe("user activation service", () => {
    describe("refreshExpirationToken", () => {
        beforeAll(() => {
            mockedUserPort.getUserWithSecretsByEmail.mockResolvedValue(USER_DBO);
            mockedUserPort.update.mockResolvedValue(USER_WITHOUT_SECRET);
        });

        afterAll(() => mockedUserPort.getUserWithSecretsByEmail.mockReset());

        it("should call userPort.getUserWithSecretsByEmail", async () => {
            await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(mockedUserPort.getUserWithSecretsByEmail).toHaveBeenCalledTimes(1);
        });

        it("should return an error object if no user found", async () => {
            const expected = {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
            mockedUserPort.getUserWithSecretsByEmail.mockResolvedValueOnce(null);
            const actual = await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(actual).toEqual(expected);
        });

        it("should return an error object if user found without jwt", async () => {
            const expected = {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
            // @ts-expect-error: test edge case
            mockedUserPort.getUserWithSecretsByEmail.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            const actual = await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(actual).toEqual(expected);
        });

        it("should call userPort.update()", async () => {
            await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(mockedUserPort.update).toHaveBeenCalledTimes(1);
        });

        it("should set jwt.expirateDate", async () => {
            await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(mockedUserPort.update).toHaveBeenCalledWith({
                ...USER_DBO,
                jwt: { token: USER_DBO.jwt.token, expirateDate: new Date(Date.now() + JWT_EXPIRES_TIME) },
            });
        });
    });

    describe("isExpiredReset", () => {
        it("should return true", () => {
            const reset = {
                createdAt: new Date(2000),
            } as unknown as UserReset;
            const actual = userActivationService.isExpiredReset(reset);
            expect(actual).toBeTruthy();
        });

        it("should return false", () => {
            const reset = {
                createdAt: new Date(),
            } as unknown as UserReset;
            const actual = userActivationService.isExpiredReset(reset);
            expect(actual).toBeFalsy();
        });
    });

    describe("validateResetToken", () => {
        const USER_RESET = {
            userId: new ObjectId(),
            token: "TOKEN",
            createdAt: new Date(),
        };

        let mockIsExpiredReset: jest.SpyInstance;

        beforeAll(() => {
            mockIsExpiredReset = jest.spyOn(userActivationService, "isExpiredReset");
            mockIsExpiredReset.mockReturnValue(false);
        });

        it("should return ResetTokenNotFoundError if token is null", () => {
            const expected = { valid: false, error: new ResetTokenNotFoundError() };
            const actual = userActivationService.validateResetToken(null);
            expect(actual).toEqual(expected);
        });

        it("should return BadRequestError if token has expired", () => {
            mockIsExpiredReset.mockReturnValueOnce(true);
            const expected = {
                valid: false,
                error: new BadRequestError(
                    "Reset token has expired, please retry forget password",
                    ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED,
                ),
            };
            const actual = userActivationService.validateResetToken(USER_RESET);
            expect(actual).toEqual(expected);
        });

        it("should return valid", () => {
            const expected = true;
            const actual = userActivationService.validateResetToken(USER_RESET).valid;
            expect(actual).toEqual(expected);
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

        let mockValidateResetToken: jest.SpyInstance;

        beforeAll(() => {
            mockValidateResetToken = jest.spyOn(userActivationService, "validateResetToken");
            mockValidateResetToken.mockImplementation(() => ({ valid: true }));
            mockedUserResetPort.findByToken.mockResolvedValue(validUserReset);
            mockedUserCrudService.getUserById.mockResolvedValue(user);
        });

        afterAll(() => {
            mockedUserResetPort.findByToken.mockReset();
            mockValidateResetToken.mockRestore();
            mockedUserCrudService.getUserById.mockReset();
        });

        it("should call find by token", async () => {
            await userActivationService.validateTokenAndGetType(FAKE_TOKEN);
            expect(mockedUserResetPort.findByToken).toBeCalledWith(FAKE_TOKEN);
        });

        it("should return true", async () => {
            const actual = await userActivationService.validateTokenAndGetType(FAKE_TOKEN);
            expect(actual.valid).toBeTruthy();
        });

        it("should call validateResetToken", async () => {
            await userActivationService.validateTokenAndGetType(FAKE_TOKEN);

            expect(mockValidateResetToken).toHaveBeenCalledWith(validUserReset);
        });

        it("should return type is SIGNUP", async () => {
            //@ts-expect-error: mock
            mockedUserResetPort.findByToken.mockResolvedValueOnce({
                createdAt: new Date(),
            });
            const actual = (await userActivationService.validateTokenAndGetType(
                FAKE_TOKEN,
            )) as TokenValidationDtoPositiveResponse;

            expect(actual.type).toBe(TokenValidationType.SIGNUP);
        });

        it("should return type is FORGET_PASSWORD", async () => {
            // @ts-expect-error: mock
            mockedUserResetPort.findByToken.mockResolvedValueOnce({
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
        const RESET_DOCUMENT = {
            _id: new ObjectId(),
            userId: new ObjectId(),
            token: "qdqzd234234ffefsfsf!",
            createdAt: new Date(),
        };

        let mockValidateResetToken: jest.SpyInstance;

        beforeAll(() => {
            mockValidateResetToken = jest.spyOn(userActivationService, "validateResetToken");
            mockValidateResetToken.mockImplementation(() => ({ valid: true }));
        });

        beforeEach(() => {
            mockedUserResetPort.findByToken.mockResolvedValue(RESET_DOCUMENT);
            mockedUserCrudService.getUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserPort.update.mockResolvedValue(USER_WITHOUT_PASSWORD);
            mockedUserCheckService.passwordValidator.mockReturnValue(true);
            mockedUserAuthService.updateJwt.mockImplementation(
                jest.fn(user => Promise.resolve({ ...user, jwt: USER_SECRETS.jwt })),
            );
        });

        afterAll(() => {
            mockedUserResetPort.findByToken.mockReset();
            mockedUserCrudService.getUserById.mockReset();
            mockedUserCheckService.passwordValidator.mockReset();
            mockedUserPort.update.mockReset();
            mockedUserAuthService.updateJwt.mockReset();
        });

        it("should call validateResetToken()", async () => {
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockValidateResetToken).toHaveBeenCalledTimes(1);
        });

        it("should reject because user not found", async () => {
            mockedUserCrudService.getUserById.mockResolvedValueOnce(null);
            expect(userActivationService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(
                new NotFoundError("User not found", ResetPasswordErrorCodes.USER_NOT_FOUND),
            );
        });

        it("should reject because password not valid", async () => {
            mockedUserCheckService.passwordValidator.mockReturnValueOnce(false);
            expect(userActivationService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(
                new BadRequestError(
                    UserCheckService.PASSWORD_VALIDATOR_MESSAGE,
                    ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
                ),
            );
        });

        it("should remove resetUser", async () => {
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedUserResetPort.remove).toHaveBeenCalledWith(RESET_DOCUMENT);
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
            expect(mockedUserPort.update).toHaveBeenCalledWith(
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

    describe("buildResetPwdUrl", () => {
        it("returns expected url", () => {
            const TOKEN = "toto";
            const actual = userActivationService.buildResetPwdUrl(TOKEN);
            expect(actual).toMatchInlineSnapshot(`"http://dev.local:5173/auth/reset-password/toto"`);
        });
    });

    describe("forgetPassword", () => {
        const TOKEN = "MyTOK3N&64qzd4qs5d4z";
        const URL = "URL";
        let mockResetUser: jest.SpyInstance;
        let mockBuildUrl: jest.SpyInstance;
        beforeAll(() => {
            mockedUserPort.findByEmail.mockResolvedValue(USER_WITHOUT_SECRET);
            mockResetUser = jest.spyOn(userActivationService, "resetUser").mockResolvedValue({
                userId: USER_WITHOUT_SECRET._id,
                token: TOKEN,
                createdAt: new Date(),
            });
            mockBuildUrl = jest.spyOn(userActivationService, "buildResetPwdUrl").mockReturnValue(URL);
        });

        afterAll(() => mockResetUser.mockRestore());

        it("should call userPort.findByEmail()", async () => {
            await userActivationService.forgetPassword(USER_EMAIL);
            expect(mockedUserPort.findByEmail).toHaveBeenCalledWith(USER_EMAIL);
        });

        it("should return undefined if user not found", async () => {
            mockedUserPort.findByEmail.mockResolvedValueOnce(null);
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
        const USER_RESET = new UserReset(USER_WITHOUT_SECRET._id, new ObjectId().toString(), new Date());
        beforeAll(() => {
            mockedUserResetPort.create.mockResolvedValue(USER_RESET);
        });

        afterAll(() => {
            mockedUserResetPort.create.mockReset();
        });

        it("should call userResetPort.removeAllByUserId()", async () => {
            await userActivationService.resetUser(USER_WITHOUT_SECRET);
            expect(mockedUserResetPort.removeAllByUserId).toHaveBeenCalledTimes(1);
        });

        it("should throw an error if reset token generation failed", async () => {
            // @ts-expect-error: test edge case
            mockedUserResetPort.create.mockResolvedValueOnce(null);
            expect(() => userActivationService.resetUser(USER_WITHOUT_SECRET)).rejects.toThrowError(
                new InternalServerError(
                    "The user reset password could not be created",
                    UserServiceErrors.CREATE_RESET_PASSWORD_WRONG,
                ),
            );
        });

        it("should call userPort.update()", async () => {
            await userActivationService.resetUser(USER_WITHOUT_SECRET);
            expect(mockedUserPort.update).toHaveBeenCalledTimes(1);
        });

        it("should deactivate user", async () => {
            await userActivationService.resetUser(USER_WITHOUT_SECRET);
            expect(mockedUserPort.update).toHaveBeenCalledWith({ ...USER_WITHOUT_SECRET, active: false });
        });

        it("should return created UserReset", async () => {
            const expected = USER_RESET;
            const actual = await userActivationService.resetUser(USER_WITHOUT_SECRET);
            expect(actual).toEqual(expected);
        });
    });

    describe("activeUser", () => {
        const INACTIVE_USER = { ...USER_WITHOUT_SECRET, active: false };
        beforeAll(() => {
            mockedUserPort.findByEmail.mockResolvedValue(INACTIVE_USER);
            mockedUserPort.update.mockResolvedValue({ ...INACTIVE_USER, active: true });
        });

        afterAll(() => {
            mockedUserPort.findByEmail.mockReset();
            mockedUserPort.update.mockReset();
        });

        it("should call userPort.findByEmail()", async () => {
            await userActivationService.activeUser(USER_EMAIL);
            expect(mockedUserPort.findByEmail).toHaveBeenCalledTimes(1);
        });

        it("should not call userPort.findByEmail()", async () => {
            await userActivationService.activeUser(INACTIVE_USER);
            expect(mockedUserPort.findByEmail).not.toHaveBeenCalled();
        });

        it("should throw NotFoundError if user not found", async () => {
            mockedUserPort.findByEmail.mockResolvedValueOnce(null);
            const expected = new NotFoundError("User email does not correspond to a user");
            expect(() => userActivationService.activeUser(USER_EMAIL)).rejects.toThrowError(expected);
        });

        it("should call userPort.update()", async () => {
            await userActivationService.activeUser(USER_EMAIL);
            expect(mockedUserPort.update).toHaveBeenCalledTimes(1);
        });

        it("should active user", async () => {
            await userActivationService.activeUser(USER_EMAIL);
            expect(mockedUserPort.update).toHaveBeenCalledWith({ ...INACTIVE_USER, active: true });
        });

        it("should return user", async () => {
            const expected = { user: { ...INACTIVE_USER, active: true } };
            const actual = await userActivationService.activeUser(INACTIVE_USER);
            expect(actual).toEqual(expected);
        });
    });
});

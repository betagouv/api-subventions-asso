import userActivationService from "./user.activation.service";
import userRepository from "../../repositories/user.repository";
import { USER_DBO, USER_SECRETS, USER_WITHOUT_PASSWORD, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import { UserService, UserServiceErrors } from "../../user.service";
import UserReset from "../../entities/UserReset";
import { ObjectId, WithId } from "mongodb";
import { BadRequestError, NotFoundError, ResetTokenNotFoundError } from "../../../../shared/errors/httpErrors";
import { ResetPasswordErrorCodes, TokenValidationDtoPositiveResponse, TokenValidationType, UserDto } from "dto";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
import userResetRepository from "../../repositories/user-reset.repository";
jest.mock("../../repositories/user-reset.repository");
const mockedUserResetRepository = jest.mocked(userResetRepository);
import userService from "../../user.service";
jest.mock("../../user.service");
const mockedUserService = jest.mocked(userService);
import userCheckService from "../check/user.check.service";
jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userAuthService from "../auth/user.auth.service";
jest.mock("../auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService);
import notifyService from "../../../notify/notify.service";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);

jest.useFakeTimers().setSystemTime(new Date("2023-01-01"));

describe("user activation service", () => {
    describe("refreshExpirationToken", () => {
        beforeAll(() => {
            mockedUserRepository.getUserWithSecretsByEmail.mockResolvedValue(USER_DBO);
            mockedUserRepository.update.mockResolvedValue(USER_WITHOUT_SECRET);
        });

        afterAll(() => mockedUserRepository.getUserWithSecretsByEmail.mockReset());

        it("should call userRepository.getUserWithSecretsByEmail", async () => {
            await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.getUserWithSecretsByEmail).toHaveBeenCalledTimes(1);
        });

        it("should return an error object if no user found", async () => {
            const expected = {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
            mockedUserRepository.getUserWithSecretsByEmail.mockResolvedValueOnce(null);
            const actual = await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(actual).toEqual(expected);
        });

        it("should return an error object if user found without jwt", async () => {
            const expected = {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
            // @ts-expect-error: test edge case
            mockedUserRepository.getUserWithSecretsByEmail.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            const actual = await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(actual).toEqual(expected);
        });

        it("should call userRepository.update()", async () => {
            await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
        });

        it("should set jwt.expirateDate", async () => {
            await userActivationService.refreshExpirationToken(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.update).toHaveBeenCalledWith({
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

            // @ts-expect-error is ExpiredReset is private
            const actual = userActivationService.isExpiredReset(reset);

            expect(actual).toBeTruthy();
        });

        it("should return false", () => {
            const reset = {
                createdAt: new Date(),
            } as unknown as UserReset;

            // @ts-expect-error is ExpiredReset is private
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
            // @ts-expect-error: private method
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
            mockedUserResetRepository.findByToken.mockResolvedValue(validUserReset);
            mockedUserService.getUserById.mockResolvedValue(user);
        });

        afterAll(() => {
            mockedUserResetRepository.findByToken.mockReset();
            mockValidateResetToken.mockRestore();
            mockedUserService.getUserById.mockReset();
        });

        it("should call find by token", async () => {
            await userActivationService.validateTokenAndGetType(FAKE_TOKEN);
            expect(mockedUserResetRepository.findByToken).toBeCalledWith(FAKE_TOKEN);
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
            mockedUserResetRepository.findByToken.mockResolvedValueOnce({
                createdAt: new Date(),
            });
            const actual = (await userActivationService.validateTokenAndGetType(
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
            mockedUserService.getUserById.mockResolvedValueOnce({
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
            mockedUserResetRepository.findByToken.mockResolvedValue(RESET_DOCUMENT);
            mockedUserService.getUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserRepository.update.mockResolvedValue(USER_WITHOUT_PASSWORD);
            mockedUserCheckService.passwordValidator.mockReturnValue(true);
            mockedUserAuthService.updateJwt.mockImplementation(
                jest.fn(user => Promise.resolve({ ...user, jwt: USER_SECRETS.jwt })),
            );
        });

        afterAll(() => {
            mockedUserResetRepository.findByToken.mockReset();
            mockedUserService.getUserById.mockReset();
            mockedUserCheckService.passwordValidator.mockReset();
            mockedUserRepository.update.mockReset();
            mockedUserAuthService.updateJwt.mockReset();
        });

        it("should call validateResetToken()", async () => {
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockValidateResetToken).toHaveBeenCalledTimes(1);
        });

        it("should reject because user not found", async () => {
            mockedUserService.getUserById.mockResolvedValueOnce(null);
            expect(userActivationService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(
                new NotFoundError("User not found", ResetPasswordErrorCodes.USER_NOT_FOUND),
            );
        });

        it("should reject because password not valid", async () => {
            mockedUserCheckService.passwordValidator.mockReturnValueOnce(false);
            expect(userActivationService.resetPassword(PASSWORD, RESET_TOKEN)).rejects.toEqual(
                new BadRequestError(
                    UserService.PASSWORD_VALIDATOR_MESSAGE,
                    ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
                ),
            );
        });

        it("should remove resetUser", async () => {
            await userActivationService.resetPassword(PASSWORD, RESET_TOKEN);
            expect(mockedUserResetRepository.remove).toHaveBeenCalledWith(RESET_DOCUMENT);
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

    describe("forgetPassword", () => {
        const TOKEN = "MyTOK3N&64qzd4qs5d4z";
        beforeAll(() => {
            mockedUserRepository.findByEmail.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserService.resetUser.mockResolvedValue({
                userId: USER_WITHOUT_SECRET._id,
                token: TOKEN,
                createdAt: new Date(),
            });
        });

        it("should call userRepository.findByEmail()", async () => {
            await userActivationService.forgetPassword(USER_EMAIL);
            expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(USER_EMAIL);
        });

        it("should return undefined if user not found", async () => {
            mockedUserRepository.findByEmail.mockResolvedValueOnce(null);
            const expected = undefined;
            const actual = await userActivationService.forgetPassword(USER_EMAIL);
            expect(actual).toEqual(expected);
        });

        it("should call userService.resetUser()", async () => {
            await userActivationService.forgetPassword(USER_EMAIL);
            expect(mockedUserService.resetUser).toHaveBeenCalledWith(USER_WITHOUT_SECRET);
        });

        it("should call notifyService.notify()", async () => {
            await userActivationService.forgetPassword(USER_EMAIL);
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_FORGET_PASSWORD, {
                email: USER_EMAIL.toLocaleLowerCase(),
                url: `${FRONT_OFFICE_URL}/auth/reset-password/${TOKEN}`,
            });
        });
    });
});

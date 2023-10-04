import userActivationService from "./user.activation.service";
import userRepository from "../../repositories/user.repository";
import { USER_DBO, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import { UserServiceErrors } from "../../user.service";
import UserReset from "../../entities/UserReset";
import { ObjectId } from "mongodb";
import { BadRequestError, ResetTokenNotFoundError } from "../../../../shared/errors/httpErrors";
import { ResetPasswordErrorCodes } from "dto";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);

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
});

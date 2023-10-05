import { ObjectId } from "mongodb";
import * as RandToken from "rand-token";
import { ResetPasswordErrorCodes, TokenValidationDtoResponse, TokenValidationType, UserDto } from "dto";
import userRepository from "../../repositories/user.repository";
import userService, { UserService, UserServiceError, UserServiceErrors } from "../../user.service";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import UserReset from "../../entities/UserReset";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
    ResetTokenNotFoundError,
    UserNotFoundError,
} from "../../../../shared/errors/httpErrors";
import userResetRepository from "../../repositories/user-reset.repository";
import notifyService from "../../../notify/notify.service";
import userAuthService from "../auth/user.auth.service";
import userCheckService from "../check/user.check.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import UserDbo from "../../repositories/dbo/UserDbo";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";

export class UserActivationService {
    async refreshExpirationToken(user: UserDto) {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(user.email);
        if (!userWithSecrets?.jwt) {
            return {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
        }

        userWithSecrets.jwt.expirateDate = new Date(Date.now() + JWT_EXPIRES_TIME);

        return await userRepository.update(userWithSecrets);
    }

    public validateResetToken(userReset: UserReset | null): { valid: false; error: Error } | { valid: true } {
        let error: Error | null = null;
        if (!userReset) error = new ResetTokenNotFoundError();
        else if (this.isExpiredReset(userReset as UserReset))
            error = new BadRequestError(
                "Reset token has expired, please retry forget password",
                ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED,
            );

        return error ? { valid: false, error } : { valid: true };
    }

    private isExpiredReset(reset: UserReset) {
        return reset.createdAt.getTime() + UserService.RESET_TIMEOUT < Date.now();
    }

    async validateTokenAndGetType(resetToken: string): Promise<TokenValidationDtoResponse> {
        const reset = await userResetRepository.findByToken(resetToken);
        const tokenValidation = userActivationService.validateResetToken(reset);
        if (!tokenValidation.valid) return tokenValidation;

        const user = await userService.getUserById((reset as UserReset).userId);
        if (!user) return { valid: false };

        return {
            ...tokenValidation,
            type: user.profileToComplete ? TokenValidationType.SIGNUP : TokenValidationType.FORGET_PASSWORD,
        };
    }

    async resetPassword(password: string, resetToken: string): Promise<UserDto> {
        const reset = await userResetRepository.findByToken(resetToken);

        const tokenValidation = userActivationService.validateResetToken(reset);
        if (!tokenValidation.valid) throw tokenValidation.error;

        const user = await userService.getUserById((reset as UserReset).userId);
        if (!user) throw new UserNotFoundError();

        if (!userCheckService.passwordValidator(password))
            throw new BadRequestError(
                UserService.PASSWORD_VALIDATOR_MESSAGE,
                ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
            );

        const hashPassword = await userAuthService.getHashPassword(password);

        await userResetRepository.remove(reset as UserReset);

        notifyService.notify(NotificationType.USER_ACTIVATED, { email: user.email });

        const userUpdated = (await userRepository.update(
            {
                ...user,
                hashPassword,
                active: true,
                profileToComplete: false,
            },
            true,
        )) as Omit<UserDbo, "hashPassword">;
        return await userAuthService.updateJwt(userUpdated);
    }

    async forgetPassword(email: string) {
        const user = await userRepository.findByEmail(email.toLocaleLowerCase());
        if (!user) return; // Don't say user not found, for security reasons

        const resetResult = await this.resetUser(user);

        notifyService.notify(NotificationType.USER_FORGET_PASSWORD, {
            email: email.toLocaleLowerCase(),
            url: `${FRONT_OFFICE_URL}/auth/reset-password/${resetResult.token}`,
        });
    }

    async findUserResetByUserId(userId: ObjectId) {
        return userResetRepository.findOneByUserId(userId);
    }

    async resetUser(user: UserDto): Promise<UserReset> {
        await userResetRepository.removeAllByUserId(user._id);

        const token = RandToken.generate(32);
        const reset = new UserReset(user._id, token, new Date());

        const createdReset = await userResetRepository.create(reset);
        if (!createdReset) {
            throw new InternalServerError(
                "The user reset password could not be created",
                UserServiceErrors.CREATE_RESET_PASSWORD_WRONG,
            );
        }

        user.active = false;

        await userRepository.update(user);

        return createdReset;
    }

    async activeUser(user: UserDto | string): Promise<UserServiceError | { user: UserDto }> {
        if (typeof user === "string") {
            const foundUser = await userRepository.findByEmail(user);
            if (!foundUser) {
                throw new NotFoundError("User email does not correspond to a user");
            }
            user = foundUser;
        }

        user.active = true;

        return { user: await userRepository.update(user) };
    }
}

const userActivationService = new UserActivationService();
export default userActivationService;

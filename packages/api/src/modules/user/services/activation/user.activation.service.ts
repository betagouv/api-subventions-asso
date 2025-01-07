import { ObjectId } from "mongodb";
import * as RandToken from "rand-token";
import { ResetPasswordErrorCodes, TokenValidationDtoResponse, TokenValidationType, UserDto } from "dto";
import userPort from "../../../../dataProviders/db/user/user.port";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import UserReset from "../../entities/UserReset";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
    ResetTokenNotFoundError,
    UserNotFoundError,
} from "../../../../shared/errors/httpErrors";
import userResetPort from "../../../../dataProviders/db/user/user-reset.port";
import notifyService from "../../../notify/notify.service";
import userAuthService from "../auth/user.auth.service";
import userCheckService, { UserCheckService } from "../check/user.check.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import UserDbo from "../../../../dataProviders/db/user/UserDbo";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import userCrudService from "../crud/user.crud.service";
import { UserServiceErrors } from "../../user.enum";
import { UserServiceError } from "../../@types/UserServiceError";

export class UserActivationService {
    public static RESET_TIMEOUT = 1000 * 60 * 60 * 24 * 10; // 10 days in ms

    async refreshExpirationToken(user: UserDto) {
        const userWithSecrets = await userPort.getUserWithSecretsByEmail(user.email);
        if (!userWithSecrets?.jwt) {
            return {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
        }

        userWithSecrets.jwt.expirateDate = new Date(Date.now() + JWT_EXPIRES_TIME);

        return await userPort.update(userWithSecrets);
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

    public isExpiredReset(reset: UserReset) {
        return reset.createdAt.getTime() + UserActivationService.RESET_TIMEOUT < Date.now();
    }

    async validateTokenAndGetType(resetToken: string): Promise<TokenValidationDtoResponse> {
        const reset = await userResetPort.findByToken(resetToken);
        const tokenValidation = userActivationService.validateResetToken(reset);
        if (!tokenValidation.valid) return tokenValidation;

        const user = await userCrudService.getUserById((reset as UserReset).userId);
        if (!user) return { valid: false };

        return {
            ...tokenValidation,
            type: user.profileToComplete ? TokenValidationType.SIGNUP : TokenValidationType.FORGET_PASSWORD,
        };
    }

    async resetPassword(password: string, resetToken: string): Promise<UserDto> {
        const reset = await userResetPort.findByToken(resetToken);

        const tokenValidation = userActivationService.validateResetToken(reset);
        if (!tokenValidation.valid) throw tokenValidation.error;

        const user = await userCrudService.getUserById((reset as UserReset).userId);
        if (!user) throw new UserNotFoundError();

        if (!userCheckService.passwordValidator(password))
            throw new BadRequestError(
                UserCheckService.PASSWORD_VALIDATOR_MESSAGE,
                ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
            );

        const hashPassword = await userAuthService.getHashPassword(password);

        await userResetPort.remove(reset as UserReset);
        const date = new Date();

        // TODO maybe send another signal with another email, the one from USER_ACTIVATED sounds weird
        notifyService.notify(NotificationType.USER_ACTIVATED, { email: user.email });
        notifyService.notify(NotificationType.USER_LOGGED, { email: user.email, date });

        const userUpdated = (await userPort.update(
            {
                ...user,
                hashPassword,
                active: true,
                profileToComplete: false,
                lastActivityDate: date,
            },
            true,
        )) as Omit<UserDbo, "hashPassword">;

        notifyService.notify(NotificationType.USER_LOGGED, {
            email: user.email,
            date: new Date(),
        });

        return await userAuthService.updateJwt(userUpdated);
    }

    buildResetPwdUrl(token: string) {
        return `${FRONT_OFFICE_URL}/auth/reset-password/${token}`;
    }

    async forgetPassword(email: string) {
        const user = await userPort.findByEmail(email.toLocaleLowerCase());
        if (!user) return; // Don't say user not found, for security reasons

        const resetResult = await this.resetUser(user);

        notifyService.notify(NotificationType.USER_FORGET_PASSWORD, {
            email: email.toLocaleLowerCase(),
            url: this.buildResetPwdUrl(resetResult.token),
        });
    }

    async findUserResetByUserId(userId: ObjectId) {
        return userResetPort.findOneByUserId(userId);
    }

    async resetUser(user: UserDto): Promise<UserReset> {
        await userResetPort.removeAllByUserId(user._id);

        const token = RandToken.generate(32);
        const reset = new UserReset(user._id, token, new Date());

        const createdReset = await userResetPort.create(reset);
        if (!createdReset) {
            throw new InternalServerError(
                "The user reset password could not be created",
                UserServiceErrors.CREATE_RESET_PASSWORD_WRONG,
            );
        }

        user.active = false;

        await userPort.update(user);

        return createdReset;
    }

    async activeUser(user: UserDto | string): Promise<UserServiceError | { user: UserDto }> {
        if (typeof user === "string") {
            const foundUser = await userPort.findByEmail(user);
            if (!foundUser) {
                throw new NotFoundError("User email does not correspond to a user");
            }
            user = foundUser;
        }

        user.active = true;

        return { user: await userPort.update(user) };
    }
}

const userActivationService = new UserActivationService();
export default userActivationService;

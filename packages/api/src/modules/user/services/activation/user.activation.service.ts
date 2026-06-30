import { ObjectId } from "mongodb";
import * as RandToken from "rand-token";
import { ResetPasswordErrorCodes, TokenValidationDtoResponse, TokenValidationType } from "dto";
import { BadRequestError, InternalServerError, ResetTokenNotFoundError, UserNotFoundError } from "core";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import userResetAdapter from "../../../../adapters/outputs/db/user/user-reset.adapter";
import notifyService from "../../../notify/notify.service";
import userAuthService from "../auth/user.auth.service";
import userCheckService, { UserCheckService } from "../check/user.check.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import userCrudService from "../crud/user.crud.service";
import { UserServiceErrors } from "../../user.enum";
import UserEntity from "../../../../domain/users/UserEntity";
import { UserResetEntity } from "../../entities/UserResetEntity";

export class UserActivationService {
    private DEFAULT_PASSWORD = "TMP_PASSWOrd;12345678";
    public static RESET_TIMEOUT = 1000 * 60 * 60 * 24 * 10; // 10 days in ms

    async refreshExpirationToken(user: UserEntity) {
        const userWithSecrets = await userAdapter.getUserWithSecretsByEmail(user.email);
        if (!userWithSecrets?.jwt) {
            return {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
        }

        userWithSecrets.jwt.expirateDate = new Date(Date.now() + JWT_EXPIRES_TIME);

        return await userAdapter.update(userWithSecrets);
    }

    public validateResetToken(userReset: UserResetEntity | null): { valid: false; error: Error } | { valid: true } {
        let error: Error | null = null;
        if (!userReset) error = new ResetTokenNotFoundError();
        else if (this.isResetExpired(userReset))
            error = new BadRequestError(
                "Reset token has expired, please retry forget password",
                ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED,
            );

        return error ? { valid: false, error } : { valid: true };
    }

    public isResetExpired(reset: UserResetEntity) {
        console.log(typeof reset.createdAt, Date.now());
        return reset.createdAt.getTime() + UserActivationService.RESET_TIMEOUT < Date.now();
    }

    async validateTokenAndGetType(resetToken: string): Promise<TokenValidationDtoResponse> {
        const reset = await userResetAdapter.findByToken(resetToken);
        if (!reset) throw new Error("User Reset Token Not Found");

        const tokenValidation = userActivationService.validateResetToken(reset);
        if (!tokenValidation.valid) return tokenValidation;

        const user = await userCrudService.getUserById(reset.userId);
        if (!user) return { valid: false };

        return {
            ...tokenValidation,
            type: user.profileToComplete ? TokenValidationType.SIGNUP : TokenValidationType.FORGET_PASSWORD,
        };
    }

    async resetPassword(password: string, resetToken: string) {
        const reset = await userResetAdapter.findByToken(resetToken);
        if (!reset) throw new ResetTokenNotFoundError();

        const tokenValidation = userActivationService.validateResetToken(reset);
        if (!tokenValidation.valid) throw tokenValidation.error;

        const user = await userCrudService.getUserById(reset.userId);
        if (!user) throw new UserNotFoundError();

        if (!userCheckService.passwordValidator(password))
            throw new BadRequestError(
                UserCheckService.PASSWORD_VALIDATOR_MESSAGE,
                ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
            );

        const hashPassword = await userAuthService.getHashPassword(password);

        await userResetAdapter.remove(reset);
        const date = new Date();

        // TODO maybe send another signal with another email, the one from USER_ACTIVATED sounds weird
        notifyService.notify(NotificationType.USER_ACTIVATED, { email: user.email });
        notifyService.notify(NotificationType.USER_LOGGED, { email: user.email, date });

        const userUpdated = await userAdapter.update(
            new UserEntity({
                ...user,
                hashPassword,
                active: true,
                profileToComplete: false,
                lastActivityDate: date,
            }),
            true,
        );

        notifyService.notify(NotificationType.USER_LOGGED, {
            email: user.email,
            date: new Date(),
        });

        return await userAuthService.updateJwt(userUpdated);
    }

    /*
     * to be used in cli not by normal users
     * */
    async setsPasswordAndActivate(user: UserEntity, password = this.DEFAULT_PASSWORD) {
        const hashPassword = await userAuthService.getHashPassword(password);
        return await userAdapter.update(
            new UserEntity({
                ...user,
                hashPassword,
                active: true,
                profileToComplete: false,
            }),
        );
    }

    buildResetPwdUrl(token: string) {
        return `${FRONT_OFFICE_URL}/auth/reset-password/${token}`;
    }

    async forgetPassword(email: string) {
        try {
            const user = await userAdapter.findByEmail(email.toLocaleLowerCase());

            if (user.proConnectId)
                throw new BadRequestError(
                    "ProConnect users should not use password",
                    ResetPasswordErrorCodes.PROCONNECT_NO_RESET,
                );

            const resetResult = await this.resetUser(user);

            notifyService.notify(NotificationType.USER_FORGET_PASSWORD, {
                email: email.toLocaleLowerCase(),
                url: this.buildResetPwdUrl(resetResult.token),
            });
        } catch (e) {
            if (e instanceof UserNotFoundError) return; // Don't say user not found, for security reasons
            throw e;
        }
    }

    async findUserResetByUserId(userId: ObjectId) {
        return userResetAdapter.findOneByUserId(userId);
    }

    async resetUser(user: UserEntity) {
        await userResetAdapter.removeAllByUserId(user.id);

        const token = RandToken.generate(32);
        const reset = { userId: user.id, token, createdAt: new Date() } as UserResetEntity;

        const createdReset = await userResetAdapter.create(reset);
        if (!createdReset) {
            throw new InternalServerError(
                "The user reset password could not be created",
                UserServiceErrors.CREATE_RESET_PASSWORD_WRONG,
            );
        }

        user.active = false;

        await userAdapter.update(user);

        return createdReset;
    }
}

const userActivationService = new UserActivationService();
export default userActivationService;

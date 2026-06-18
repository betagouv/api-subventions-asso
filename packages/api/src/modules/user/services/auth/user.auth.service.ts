import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
    LoginError,
} from "core";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import { JWT_EXPIRES_TIME, JWT_SECRET } from "../../../../configurations/jwt.conf";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userCheckService, { UserCheckService } from "../check/user.check.service";
import { UserUpdateError } from "../../../../adapters/outputs/db/user/@errors/UserUpdateError";
import { UserConsumerService } from "../consumer/user.consumer.service";
import { getNewJwtExpireDate } from "../../user.helper";
import UserEntity from "../../../../domain/users/UserEntity";
import NewUserEntity from "../../../../domain/users/NewUserEntity";
import PlainObject from "../../../../@types/PlainObject";

export class UserAuthService {
    public async getHashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    // Only used in tests
    public async findJwtByEmail(email: string): Promise<{ jwt: { token: string; expirateDate: Date } }> {
        const userWithSecrets = await userAdapter.getUserWithSecretsByEmail(email);

        if (!userWithSecrets) {
            throw new NotFoundError("User not found");
        }

        if (!userWithSecrets.jwt) {
            throw new BadRequestError("User is not active");
        }

        return { jwt: userWithSecrets.jwt };
    }

    public buildJWTToken(
        user: PlainObject<UserEntity> | PlainObject<NewUserEntity>,
        options: { expiration: boolean; [UserConsumerService.CONSUMER_TOKEN_PROP]: boolean } = {
            expiration: true,
            isConsumerToken: false,
        },
    ) {
        const { jwt: _token, ...safeUser } = user;
        const jwtContent = {
            ...safeUser,
            now: new Date(),
            [UserConsumerService.CONSUMER_TOKEN_PROP]: options[UserConsumerService.CONSUMER_TOKEN_PROP],
        };

        const jwtOption: jwt.SignOptions = {};

        if (options.expiration) {
            jwtOption.expiresIn = JWT_EXPIRES_TIME;
        }

        return jwt.sign(jwtContent, JWT_SECRET, jwtOption);
    }

    public async updatePassword(user: UserEntity, password: string) {
        if (!userCheckService.passwordValidator(password)) {
            throw new BadRequestError(UserCheckService.PASSWORD_VALIDATOR_MESSAGE);
        }

        const userUpdated = await userAdapter.update(
            new UserEntity({
                ...user,
                hashPassword: await this.getHashPassword(password),
                active: true,
            }),
        );
        return { user: userUpdated };
    }

    public async logout(user: UserEntity) {
        const userWithSecrets = await userAdapter.getUserWithSecretsByEmail(user.email);

        if (!userWithSecrets?.jwt) {
            // No jwt, so user is already disconnected
            return user;
        }

        const { jwt, ...logoutUser } = userWithSecrets;
        return userAdapter.update(new UserEntity({ ...logoutUser }));
    }

    async updateJwt(user: UserEntity) {
        const updatedJwt = {
            token: this.buildJWTToken(user),
            expirateDate: getNewJwtExpireDate(),
        };

        const updatedUser = new UserEntity({ ...user, jwt: updatedJwt });

        try {
            return userAdapter.update(updatedUser, true);
        } catch {
            throw new InternalServerError(UserUpdateError.message);
        }
    }

    async login(email: string, password: string) {
        const user = await userAdapter.getUserWithSecretsByEmail(email);
        if (!user) throw new LoginError();
        if (!user.hashPassword) throw new UnauthorizedError("User has not set a password so they can't login this way");
        const validPassword = await bcrypt.compare(password, user.hashPassword);
        if (!validPassword) throw new LoginError();
        if (!user.active) throw new ForbiddenError("User is not active");

        const updatedUser = await this.updateJwt(user);

        notifyService.notify(NotificationType.USER_LOGGED, {
            email,
            date: new Date(),
        });

        return updatedUser;
    }

    async authenticate(tokenPayload, token) {
        // Find the user associated with the email provided by the user
        const user = await userAdapter.getUserWithSecretsByEmail(tokenPayload.email);
        if (!user) throw new NotFoundError("User not found");

        if (!tokenPayload[UserConsumerService.CONSUMER_TOKEN_PROP]) {
            if (!user.active) throw new ForbiddenError("User is not active");

            if (new Date(tokenPayload.now).getTime() + JWT_EXPIRES_TIME < Date.now())
                throw new UnauthorizedError("JWT has expired, please login try again");

            if (user.jwt?.token !== token) throw new UnauthorizedError("JWT has expired, please login try again");
        }
        const { hashPassword, ...safeUser } = user;
        return safeUser;
    }
}

const userAuthService = new UserAuthService();
export default userAuthService;

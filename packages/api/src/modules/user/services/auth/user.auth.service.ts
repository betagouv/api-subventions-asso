import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginDtoErrorCodes, UserDto, UserErrorCodes, UserWithJWTDto } from "dto";
import userPort from "../../../../dataProviders/db/user/user.port";
import {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from "../../../../shared/errors/httpErrors";
import { JWT_EXPIRES_TIME, JWT_SECRET } from "../../../../configurations/jwt.conf";
import UserDbo from "../../../../dataProviders/db/user/UserDbo";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userCheckService, { UserCheckService } from "../check/user.check.service";
import { UserUpdateError } from "../../../../dataProviders/db/user/UserUpdateError";
import LoginError from "../../../../shared/errors/LoginError";
import { removeSecrets } from "../../../../shared/helpers/PortHelper";
import { UserConsumerService } from "../consumer/user.consumer.service";
import { UserServiceErrors } from "../../user.enum";
import { getNewJwtExpireDate } from "../../user.helper";

export class UserAuthService {
    public async getHashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    // Only used in tests
    public async findJwtByEmail(email: string): Promise<{ jwt: { token: string; expirateDate: Date } }> {
        const userWithSecrets = await userPort.getUserWithSecretsByEmail(email);

        if (!userWithSecrets) {
            throw new NotFoundError("User not found");
        }

        if (!userWithSecrets.jwt) {
            throw new BadRequestError("User is not active");
        }

        return { jwt: userWithSecrets.jwt };
    }

    public async findJwtByUser(user: UserDto) {
        const userDbo = await userPort.getUserWithSecretsById(user._id);
        return userDbo?.jwt;
    }

    public buildJWTToken(
        user: Omit<UserDbo, "hashPassword"> | UserDto,
        options: { expiration: boolean } = { expiration: true },
    ) {
        const userNoJwt = removeSecrets(user);
        const jwtContent = { ...userNoJwt, now: new Date() };
        const jwtOption: jwt.SignOptions = {};

        if (options.expiration) {
            jwtOption.expiresIn = JWT_EXPIRES_TIME;
        }

        return jwt.sign(jwtContent, JWT_SECRET, jwtOption);
    }

    public async updatePassword(user: UserDto, password: string): Promise<{ user: UserDto }> {
        if (!userCheckService.passwordValidator(password)) {
            throw new BadRequestError(UserCheckService.PASSWORD_VALIDATOR_MESSAGE, UserErrorCodes.INVALID_PASSWORD);
        }

        const userUpdated = await userPort.update({
            ...user,
            hashPassword: await this.getHashPassword(password),
            active: true,
        });
        return { user: userUpdated };
    }

    public async logout(user: UserDto) {
        const userWithSecrets = await userPort.getUserWithSecretsByEmail(user.email);

        if (!userWithSecrets?.jwt) {
            // No jwt, so user is already disconnected
            return user;
        }

        return userPort.update({ ...user, jwt: null });
    }

    async updateJwt(user: Omit<UserDbo, "hashPassword">): Promise<UserWithJWTDto> {
        const updatedJwt = {
            token: this.buildJWTToken(user),
            expirateDate: getNewJwtExpireDate(),
        };

        try {
            user.jwt = updatedJwt;
            return (await userPort.update(user, true)) as UserWithJWTDto;
        } catch (e) {
            throw new InternalServerError(UserUpdateError.message, UserServiceErrors.LOGIN_UPDATE_JWT_FAIL);
        }
    }

    async login(email: string, password: string): Promise<Omit<UserDbo, "hashPassword">> {
        const user = await userPort.getUserWithSecretsByEmail(email);

        if (!user) throw new LoginError();
        if (!user.hashPassword)
            throw new UnauthorizedError(
                "User has not set a password so they can't login this way",
                LoginDtoErrorCodes.PASSWORD_UNSET,
            );
        const validPassword = await bcrypt.compare(password, user.hashPassword);
        if (!validPassword) throw new LoginError();
        if (!user.active) throw new UnauthorizedError("User is not active", LoginDtoErrorCodes.USER_NOT_ACTIVE);

        const updatedUser = await this.updateJwt(user);

        notifyService.notify(NotificationType.USER_LOGGED, {
            email,
            date: new Date(),
        });

        return updatedUser;
    }

    async authenticate(tokenPayload, token): Promise<UserDto> {
        // Find the user associated with the email provided by the user
        const user = await userPort.getUserWithSecretsByEmail(tokenPayload.email);
        if (!user) throw new NotFoundError("User not found", UserServiceErrors.USER_NOT_FOUND);

        if (!tokenPayload[UserConsumerService.CONSUMER_TOKEN_PROP]) {
            if (!user.active) throw new ForbiddenError("User is not active", UserServiceErrors.USER_NOT_ACTIVE);

            if (new Date(tokenPayload.now).getTime() + JWT_EXPIRES_TIME < Date.now())
                throw new UnauthorizedError(
                    "JWT has expired, please login try again",
                    UserServiceErrors.LOGIN_UPDATE_JWT_FAIL,
                );

            if (user.jwt?.token !== token)
                throw new UnauthorizedError(
                    "JWT has expired, please login try again",
                    UserServiceErrors.LOGIN_UPDATE_JWT_FAIL,
                );
        }
        return removeSecrets(user) as UserDto;
    }
}

const userAuthService = new UserAuthService();
export default userAuthService;

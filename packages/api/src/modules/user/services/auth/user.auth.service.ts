import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserDto, UserErrorCodes, UserWithJWTDto } from "dto";
import userRepository from "../../repositories/user.repository";
import { BadRequestError, InternalServerError, NotFoundError } from "../../../../shared/errors/httpErrors";
import { JWT_EXPIRES_TIME, JWT_SECRET } from "../../../../configurations/jwt.conf";
import UserDbo from "../../repositories/dbo/UserDbo";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userCheckService, { UserCheckService } from "../check/user.check.service";
import { UserServiceErrors } from "../../user.service";
import { UserUpdateError } from "../../repositories/errors/UserUpdateError";

export class UserAuthService {
    public async getHashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    // Only used in tests
    public async findJwtByEmail(email: string): Promise<{ jwt: { token: string; expirateDate: Date } }> {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(email);

        if (!userWithSecrets) {
            throw new NotFoundError("User not found");
        }

        if (!userWithSecrets.jwt) {
            throw new BadRequestError("User is not active");
        }

        return { jwt: userWithSecrets.jwt };
    }

    public async findJwtByUser(user: UserDto) {
        const userDbo = await userRepository.getUserWithSecretsById(user._id);
        return userDbo?.jwt;
    }

    public buildJWTToken(
        user: Omit<UserDbo, "hashPassword"> | UserDto,
        options: { expiration: boolean } = { expiration: true },
    ) {
        const jwtContent = { ...user, now: new Date() };
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

        const userUpdated = await userRepository.update({
            ...user,
            hashPassword: await userAuthService.getHashPassword(password),
            active: true,
        });

        notifyService.notify(NotificationType.USER_ACTIVATED, { email: user.email });

        return { user: userUpdated };
    }

    public async logout(user: UserDto) {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(user.email);

        if (!userWithSecrets?.jwt) {
            // No jwt, so user is already disconnected
            return user;
        }

        return userRepository.update({ ...user, jwt: null });
    }

    async updateJwt(user: Omit<UserDbo, "hashPassword">): Promise<UserWithJWTDto> {
        // Generate new JTW Token
        const now = new Date();

        const updatedJwt = {
            token: userAuthService.buildJWTToken(user),
            expirateDate: new Date(now.getTime() + JWT_EXPIRES_TIME),
        };

        try {
            user.jwt = updatedJwt;
            return (await userRepository.update(user, true)) as UserWithJWTDto;
        } catch (e) {
            throw new InternalServerError(UserUpdateError.message, UserServiceErrors.LOGIN_UPDATE_JWT_FAIL);
        }
    }
}

const userAuthService = new UserAuthService();
export default userAuthService;

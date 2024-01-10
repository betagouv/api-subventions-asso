import { FutureUserDto, SignupErrorCodes, UserDto, UserWithResetTokenDto } from "dto";
import { DefaultObject } from "../../../../@types";
import userRepository from "../../repositories/user.repository";
import userCheckService from "../check/user.check.service";
import userResetRepository from "../../repositories/user-reset.repository";
import consumerTokenRepository from "../../repositories/consumer-token.repository";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userStatsService from "../stats/user.stats.service";
import { RoleEnum } from "../../../../@enums/Roles";
import userAuthService from "../auth/user.auth.service";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import { DEFAULT_PWD } from "../../user.constant";
import { UserNotPersisted } from "../../repositories/dbo/UserDbo";
import { BadRequestError, InternalServerError, NotFoundError } from "../../../../shared/errors/httpErrors";
import userConsumerService from "../consumer/user.consumer.service";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import userActivationService from "../activation/user.activation.service";
import { removeSecrets } from "../../../../shared/helpers/RepositoryHelper";
import { UserServiceErrors } from "../../user.enum";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";

export class UserCrudService {
    find(query: DefaultObject = {}) {
        return userRepository.find(query);
    }

    findByEmail(email: string) {
        return userRepository.findByEmail(email);
    }

    public getUserById(userId) {
        return userRepository.findById(userId);
    }

    public async update(user: Partial<UserDto> & Pick<UserDto, "email">): Promise<UserDto> {
        await userCheckService.validateEmail(user.email);
        return await userRepository.update(user);
    }

    public async delete(userId: string): Promise<boolean> {
        const user = await this.getUserById(userId);

        if (!user) return false;

        if (!(await userRepository.delete(user))) return false;

        const deletePromises = [
            userResetRepository.removeAllByUserId(user._id),
            consumerTokenRepository.deleteAllByUserId(user._id),
        ];

        return (await Promise.all(deletePromises)).every(success => success);
    }

    public async listUsers(): Promise<UserWithResetTokenDto[]> {
        const users = await userStatsService.getUsersWithStats(true);
        return await Promise.all(
            users.map(async user => {
                const reset = await userResetRepository.findOneByUserId(user._id);
                return {
                    ...user,
                    resetToken: reset?.token,
                    resetTokenDate: reset?.createdAt,
                };
            }),
        );
    }

    async createUser(userObject: FutureUserDto): Promise<UserDto> {
        // default values and ensures format
        if (!userObject.roles) userObject.roles = [RoleEnum.user];

        const sanitizedUser = await userCheckService.validateSanitizeUser(userObject);

        const partialUser = {
            email: userObject.email,
            signupAt: new Date(),
            roles: sanitizedUser.roles,
            firstName: sanitizedUser.firstName || null,
            lastName: sanitizedUser.lastName || null,
            profileToComplete: true,
            lastActivityDate: null,
        };

        const now = new Date();
        const jwtParams = {
            token: userAuthService.buildJWTToken(partialUser as UserDto),
            expirateDate: new Date(now.getTime() + JWT_EXPIRES_TIME),
        };

        const user = {
            ...partialUser,
            jwt: jwtParams,
            hashPassword: await userAuthService.getHashPassword(DEFAULT_PWD),
            active: false,
        } as UserNotPersisted;

        const createdUser = await userRepository.create(user);

        if (!createdUser)
            throw new InternalServerError("The user could not be created", UserServiceErrors.CREATE_USER_WRONG);

        return createdUser;
    }

    public async signup(userObject: FutureUserDto, role = RoleEnum.user): Promise<UserDto> {
        userObject.roles = [role];

        let user;
        if (role == RoleEnum.consumer) {
            user = await userConsumerService.createConsumer(userObject);
        } else {
            try {
                user = await userCrudService.createUser(userObject);
            } catch (e) {
                if (e instanceof BadRequestError && e.code === UserServiceErrors.CREATE_EMAIL_GOUV)
                    throw new BadRequestError(e.message, SignupErrorCodes.EMAIL_MUST_BE_END_GOUV);
                if (e instanceof DuplicateIndexError) {
                    notifyService.notify(NotificationType.USER_CONFLICT, userObject);
                    throw new InternalServerError("An error has occurred");
                }
                throw e;
            }
        }

        const resetResult = await userActivationService.resetUser(user);

        notifyService.notify(NotificationType.USER_CREATED, {
            email: userObject.email,
            firstname: userObject.firstName,
            lastname: userObject.lastName,
            url: `${FRONT_OFFICE_URL}/auth/activate/${resetResult.token}`,
            active: user.active,
            signupAt: user.signupAt,
        });

        return user;
    }

    async getUserWithoutSecret(email: string) {
        const withSecrets = await userRepository.getUserWithSecretsByEmail(email);
        if (!withSecrets) throw new NotFoundError("User not found");
        return removeSecrets(withSecrets);
    }
}

const userCrudService = new UserCrudService();
export default userCrudService;

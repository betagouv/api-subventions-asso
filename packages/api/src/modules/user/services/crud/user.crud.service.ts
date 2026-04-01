import { FutureUserDto, SignupErrorCodes, UserDto, UserWithJWTDto, UserWithResetTokenDto } from "dto";
import { BadRequestError, InternalServerError, NotFoundError } from "core";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";
import { DefaultObject } from "../../../../@types";
import userAdapter from "../../../../dataProviders/db/user/user.adapter";
import userCheckService from "../check/user.check.service";
import userResetAdapter from "../../../../dataProviders/db/user/user-reset.adapter";
import consumerTokenAdapter from "../../../../dataProviders/db/user/consumer-token.adapter";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { RoleEnum } from "../../../../@enums/RolesEnum";
import userAuthService from "../auth/user.auth.service";
import { UserNotPersisted } from "../../../../dataProviders/db/user/@types/UserDbo";
import userConsumerService from "../consumer/user.consumer.service";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import userActivationService from "../activation/user.activation.service";
import { removeSecrets } from "../../../../shared/helpers/PortHelper";
import { UserServiceErrors } from "../../user.enum";
import { getNewJwtExpireDate } from "../../user.helper";

export class UserCrudService {
    find(query: DefaultObject = {}) {
        return userAdapter.find(query);
    }

    getConsumers() {
        return this.find({ roles: RoleEnum.consumer });
    }

    findByEmail(email: string) {
        return userAdapter.findByEmail(email);
    }

    public findUsersByIdList(ids: string[]) {
        return userAdapter.findByIds(ids);
    }

    public getUserById(userId) {
        return userAdapter.findById(userId);
    }

    public async update(user: Partial<UserDto> & Pick<UserDto, "email">): Promise<UserDto> {
        const fullUser = await userCrudService.findByEmail(user.email);

        if (fullUser?.agentConnectId) userCheckService.validateOnlyEmail(user.email);
        else await userCheckService.validateEmailAndDomain(user.email);

        return await userAdapter.update(user);
    }

    public async delete(userId: string): Promise<boolean> {
        const user = await this.getUserById(userId);

        if (!user) return false;

        if (!(await userAdapter.delete(user))) return false;

        const deletePromises = [
            userResetAdapter.removeAllByUserId(user._id),
            consumerTokenAdapter.deleteAllByUserId(user._id),
        ];

        return (await Promise.all(deletePromises)).every(success => success);
    }

    public async listUsers(): Promise<UserWithResetTokenDto[]> {
        const users = await this.find();
        return await Promise.all(
            users.map(async user => {
                const reset = await userResetAdapter.findOneByUserId(user._id);
                if (!reset || userActivationService.isResetExpired(reset)) return user;
                return {
                    ...user,
                    resetToken: reset?.token,
                    resetTokenDate: reset?.createdAt,
                    resetUrl: userActivationService.buildResetPwdUrl(reset?.token),
                };
            }),
        );
    }

    async createUser(userObject: FutureUserDto, withJWT = false): Promise<UserDto | UserWithJWTDto> {
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
            agentConnectId: userObject.agentConnectId,
            nbVisits: 0,
        } as unknown;

        const jwtParams = {
            token: userAuthService.buildJWTToken(partialUser as UserDto),
            expirateDate: getNewJwtExpireDate(),
        };

        const user = {
            ...(partialUser as UserDto),
            jwt: jwtParams,
            active: !!userObject.agentConnectId,
        } as UserNotPersisted;

        const createdUser = withJWT ? await userAdapter.createAndReturnWithJWT(user) : await userAdapter.create(user);

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
            isAgentConnect: false,
        });

        return user;
    }

    async getUserWithoutSecret(email: string) {
        const withSecrets = await userAdapter.getUserWithSecretsByEmail(email);
        if (!withSecrets) throw new NotFoundError("User not found");
        return removeSecrets(withSecrets);
    }
}

const userCrudService = new UserCrudService();
export default userCrudService;

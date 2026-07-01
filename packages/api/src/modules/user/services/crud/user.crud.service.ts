import { BadRequestError, InternalServerError } from "core";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";
import { DefaultObject } from "../../../../@types";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import userCheckService, { EmailDomainNotAcceptedError } from "../check/user.check.service";
import userResetAdapter from "../../../../adapters/outputs/db/user/user-reset.adapter";
import consumerTokenAdapter from "../../../../adapters/outputs/db/user/consumer-token.adapter";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { RoleEnum } from "../../../../domain/users/@types/UserRoles";
import userAuthService from "../auth/user.auth.service";
import userConsumerService from "../consumer/user.consumer.service";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import userActivationService from "../activation/user.activation.service";
import { getNewJwtExpireDate } from "../../user.helper";
import NewUserEntity from "../../../../domain/users/NewUserEntity";
import UserEntity from "../../../../domain/users/UserEntity";

export class UserCrudService {
    find(query?: DefaultObject) {
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

    public async update(user: UserEntity) {
        const fullUser = await userCrudService.findByEmail(user.email);

        if (fullUser?.proConnectId) userCheckService.validateOnlyEmail(user.email);
        else await userCheckService.validateEmailAndDomain(user.email);

        return userAdapter.update(user);
    }

    public async delete(userId: string): Promise<boolean> {
        const user = await this.getUserById(userId);

        if (!user) return false;

        if (!(await userAdapter.delete(user))) return false;

        const deletePromises = [
            userResetAdapter.removeAllByUserId(user.id),
            consumerTokenAdapter.deleteAllByUserId(user.id),
        ];

        return (await Promise.all(deletePromises)).every(success => success);
    }

    public async listUsers() {
        const users = await this.find();
        return await Promise.all(
            users.map(async user => {
                const reset = await userResetAdapter.findOneByUserId(user.id);
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

    async createUser(newUser: NewUserEntity) {
        const sanitizedUser = await userCheckService.validateSanitizeUser(newUser);

        const partialUser = new NewUserEntity({
            email: newUser.email,
            roles: sanitizedUser.roles,
            firstName: sanitizedUser.firstName,
            lastName: sanitizedUser.lastName,
            proConnectId: newUser.proConnectId,
        });

        const jwtParams = {
            token: userAuthService.buildJWTToken(partialUser),
            expirateDate: getNewJwtExpireDate(),
        };

        // @TODO: maybe AbstractUser should implement a method to add jwt to avoid creating another Entity ?
        const user = new NewUserEntity({
            ...partialUser,
            jwt: jwtParams,
        });

        const createdUser = await userAdapter.create(user);

        if (!createdUser) throw new InternalServerError("The user could not be created");

        return createdUser;
    }

    public async signup(newUser: NewUserEntity) {
        let user;
        if (newUser.roles.includes(RoleEnum.consumer)) {
            user = await userConsumerService.createConsumer(newUser);
        } else {
            try {
                user = await userCrudService.createUser(newUser);
            } catch (e) {
                if (e instanceof EmailDomainNotAcceptedError) throw new BadRequestError(e.message);
                if (e instanceof DuplicateIndexError) {
                    notifyService.notify(NotificationType.USER_CONFLICT, newUser);
                    throw new InternalServerError("An error has occurred");
                }
                throw e;
            }
        }

        const resetResult = await userActivationService.resetUser(user);

        notifyService.notify(NotificationType.USER_CREATED, {
            email: newUser.email,
            firstname: newUser.firstName,
            lastname: newUser.lastName,
            url: `${FRONT_OFFICE_URL}/auth/activate/${resetResult.token}`,
            active: user.active,
            signupAt: user.signupAt,
            isProConnect: false,
        });

        return user;
    }
}

const userCrudService = new UserCrudService();
export default userCrudService;

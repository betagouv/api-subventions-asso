import { UserDataDto, UserDto } from "dto";
import { NotFoundError } from "../../../../shared/errors/httpErrors";
import userResetRepository from "../../repositories/user-reset.repository";
import consumerTokenRepository from "../../repositories/consumer-token.repository";
import { uniformizeId } from "../../../../shared/helpers/RepositoryHelper";
import statsService from "../../../stats/stats.service";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userRepository from "../../repositories/user.repository";
import userCrudService from "../crud/user.crud.service";
import { DefaultObject } from "../../../../@types";

export class UserRgpdService {
    public async getAllData(userId: string): Promise<UserDataDto> {
        const user = await userCrudService.getUserById(userId);

        if (!user) throw new NotFoundError("User is not found");

        const userIdToString = document => ({ ...document, userId: document.userId.toString() });

        const tokens = [
            ...(await userResetRepository.findByUserId(userId)),
            ...(await consumerTokenRepository.find(userId)),
        ]
            .map(uniformizeId)
            .map(userIdToString);

        const associationVisits = await statsService.getAllVisitsUser(userId);
        const userLogs = await statsService.getAllLogUser(user.email);

        return {
            user,
            tokens,
            logs: userLogs,
            statistics: {
                associationVisit: associationVisits.map(userIdToString),
            },
        };
    }

    public async disableById(userId: string, self = true) {
        const user = await userCrudService.getUserById(userId);
        return this.disable(user, self);
    }

    public async disable(user: UserDto | null, self = true, whileBatch = false) {
        if (!user) return false;
        // Anonymize the user when it is being deleted to keep use stats consistent
        // It keeps roles and signupAt in place to avoid breaking any stats
        const disabledUser = {
            ...user,
            active: false,
            email: `${user._id}@deleted.datasubvention.beta.gouv.fr`,
            jwt: null,
            hashPassword: "",
            disable: true,
            firstName: "",
            lastName: "",
        };

        if (!whileBatch) notifyService.notify(NotificationType.USER_DELETED, { email: user.email, selfDeleted: self });

        return !!(await userRepository.update(disabledUser));
    }

    async bulkDisableInactive() {
        const now = new Date();

        const lastActivityLimit = new Date(now.valueOf());
        lastActivityLimit.setFullYear(now.getFullYear() - 2);
        const inactiveUsersToDisable = await userRepository.findInactiveSince(lastActivityLimit);

        const lastSubscriptionNotActivatedLimit = new Date(now.valueOf());
        lastSubscriptionNotActivatedLimit.setUTCMonth(now.getUTCMonth() - 6);
        const neverSeenUsersToDisable = await userRepository.findNotActivatedSince(lastSubscriptionNotActivatedLimit);

        const usersToDisable = [...inactiveUsersToDisable, ...neverSeenUsersToDisable];
        const disablePromises = usersToDisable.map(user => this.disable(user, false, true));
        const results = await Promise.all(disablePromises);

        if (results.length)
            notifyService.notify(NotificationType.BATCH_USERS_DELETED, {
                users: usersToDisable.map(user => ({
                    email: user.email,
                    firstname: user.firstName,
                    lastname: user.lastName,
                })),
            });
        return results.every(Boolean);
    }

    async findAnonymizedUsers(query: DefaultObject = {}) {
        const users = await userCrudService.find(query);

        return users.map(user => {
            return {
                ...user,
                email: undefined,
                firstName: undefined,
                lastName: undefined,
                phoneNumber: undefined,
            };
        });
    }
}

const userRgpdService = new UserRgpdService();
export default userRgpdService;

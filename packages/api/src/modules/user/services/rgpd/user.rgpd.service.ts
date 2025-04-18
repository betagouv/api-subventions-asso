import { UserDataDto, UserDto } from "dto";
import * as Sentry from "@sentry/node";
import { NotFoundError } from "core";
import userResetPort from "../../../../dataProviders/db/user/user-reset.port";
import consumerTokenPort from "../../../../dataProviders/db/user/consumer-token.port";
import { uniformizeId } from "../../../../shared/helpers/PortHelper";
import statsService from "../../../stats/stats.service";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userPort from "../../../../dataProviders/db/user/user.port";
import userCrudService from "../crud/user.crud.service";
import { DefaultObject } from "../../../../@types";
import userActivationService from "../activation/user.activation.service";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import configurationsPort from "../../../../dataProviders/db/configurations/configurations.port";
import configurationsService, { CONFIGURATION_NAMES } from "../../../configurations/configurations.service";
import { STALL_RGPD_CRON_6_MONTHS_DELETION } from "../../../../configurations/mail.conf";
import logsPort from "../../../../dataProviders/db/stats/logs.port";

export class UserRgpdService {
    public async getAllData(userId: string): Promise<UserDataDto> {
        const user = await userCrudService.getUserById(userId);

        if (!user) throw new NotFoundError("User is not found");

        const userIdToString = document => ({ ...document, userId: document.userId.toString() });

        const tokens = [...(await userResetPort.findByUserId(userId)), ...(await consumerTokenPort.find(userId))]
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
            phoneNumber: "",
        };
        const promises = Promise.all([
            logsPort.anonymizeLogsByUser(user, disabledUser),
            userPort.update(disabledUser).then(r => !!r),
        ]);

        if (!whileBatch) notifyService.notify(NotificationType.USER_DELETED, { email: user.email, selfDeleted: self });

        return (await promises).every(r => r);
    }

    /*
     * deletes automatically users that either
     * - never ever logged in (even to activate account) for 6 month
     * - did not log in for 2 years */
    async bulkDisableInactive() {
        const now = new Date();

        const lastActivityLimit = new Date(now.valueOf());
        lastActivityLimit.setFullYear(now.getFullYear() - 2);
        const inactiveUsersToDisable = await userPort.findInactiveSince(lastActivityLimit);

        const subscriptionNotActivatedLimit = new Date(now.valueOf());
        subscriptionNotActivatedLimit.setUTCMonth(now.getUTCMonth() - 6);
        const neverSeenUsersToDisable = await userPort.findNotActivatedSince(subscriptionNotActivatedLimit);
        if (STALL_RGPD_CRON_6_MONTHS_DELETION < now)
            console.log(`rgpdCron: ${neverSeenUsersToDisable.length} seraient supprimés si la feature était activée`);

        const usersToDisable = [
            ...inactiveUsersToDisable,
            ...(STALL_RGPD_CRON_6_MONTHS_DELETION < now ? neverSeenUsersToDisable : []), // TODO clean after the 2024-07-08
        ];
        const disablePromises = usersToDisable.map(user =>
            this.disable(user, false, true).catch(e => {
                Sentry.captureException(e);
                return false;
            }),
        );
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

    /*
     * one month ahead, warn users that will be deleted because they
     * never ever logged in (even to activate account) for 6 months.
     * Also send them an activation link so that they can come back easily.
     *
     * The users that did not log in for 2 years will be warned via pure brevo automation */
    async warnDisableInactive() {
        const now = new Date();
        const lastWarningWave = (await configurationsPort.getByName<Date>(CONFIGURATION_NAMES.LAST_RGPD_WARNED_DATE))
            ?.data;
        const lastSubscriptionNotActivatedLimit = new Date(now.valueOf());
        lastSubscriptionNotActivatedLimit.setUTCMonth(now.getUTCMonth() - 5);
        const usersToWarn = await userPort.findNotActivatedSince(lastSubscriptionNotActivatedLimit, lastWarningWave);

        const promises = usersToWarn.map(user =>
            userActivationService
                .resetUser(user)
                .then(reset => {
                    notifyService.notify(NotificationType.WARN_NEW_USER_TO_BE_DELETED, {
                        email: user.email,
                        activationLink: `${FRONT_OFFICE_URL}/auth/reset-password/${reset.token}`,
                    });
                    return true;
                })
                .catch(error => {
                    Sentry.captureException(error);
                    return false;
                }),
        );
        await configurationsService.updateConfigEntity(
            CONFIGURATION_NAMES.LAST_RGPD_WARNED_DATE,
            lastSubscriptionNotActivatedLimit,
        );
        const results = await Promise.all(promises);
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

import { UserDto } from "dto";
import userPort from "../../../../dataProviders/db/user/user.port";
import UserReset from "../../entities/UserReset";
import userResetPort from "../../../../dataProviders/db/user/user-reset.port";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import { NotificationType } from "../../../notify/@types/NotificationType";
import notifyService from "../../../notify/notify.service";
import { NotificationDataTypes } from "../../../notify/@types/NotificationDataTypes";
import ExecutionSyncStack from "../../../../shared/ExecutionSyncStack";
import userCrudService from "../crud/user.crud.service";
import configurationsService from "../../../configurations/configurations.service";
import statsAssociationsVisitPort from "../../../../dataProviders/db/stats/statsAssociationsVisit.port";

export class UserStatsService {
    public countTotalUsersOnDate(date, withAdmin = false) {
        return userPort.countTotalUsersOnDate(date, withAdmin);
    }

    public findByPeriod(begin: Date, end: Date, withAdmin = false) {
        return userPort.findByPeriod(begin, end, withAdmin);
    }

    public getUsersWithStats(): Promise<UserDto[]> {
        return userCrudService.find();
    }

    public async updateNbRequests() {
        const since = await configurationsService.getLastUserStatsUpdate();
        return this.updateNbRequestsByDate(since, new Date());
    }

    private async updateNbRequestsByDate(since: Date, until: Date) {
        const countByUser = (await statsAssociationsVisitPort.findGroupedByUserIdentifierOnPeriod(since, until)).map(
            ({ _id, associationVisits }) => ({
                _id,
                count: associationVisits.length,
            }),
        );
        await userPort.updateNbRequests(countByUser);
        await configurationsService.setLastUserStatsUpdate(until);

        // should we await this ? to ensure we got feedback from Brevo update ?
        await this.updateNbRequestsInBrevo(countByUser);
    }

    private async updateNbRequestsInBrevo(countByUser: { _id: string; count: number }[]) {
        const userIds = countByUser.map(userCount => userCount._id);
        const usersIdWithEmail = await userPort.findEmails(userIds);
        const emailsWithNbRequests: { email: string; requests: number }[] = [];
        countByUser.forEach(idWithCount => {
            const email = usersIdWithEmail.find(idWithEmail => idWithCount._id === idWithEmail._id)?.email;
            if (email) {
                emailsWithNbRequests.push({ email, requests: idWithCount.count });
            } else
                console.warn(`Trying to update the number of requests for an unknown user with id ${idWithCount._id}`);
        });

        await notifyService.notify(NotificationType.STATS_NB_REQUESTS, emailsWithNbRequests);
    }

    async notifyAllUsersInSubTools() {
        const users = await userPort.findAll();

        for (const user of users) {
            if (user.disable) continue;

            let reset: null | UserReset = null;
            if (!user.active) {
                reset = await userResetPort.findOneByUserId(user._id);
            }

            const data = {
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName,
                region: user.region,
                url: reset ? `${FRONT_OFFICE_URL}/auth/reset-password/${reset.token}?active=true` : undefined,
                active: user.active,
                signupAt: user.signupAt,
            };

            await notifyService.notify(NotificationType.USER_ALREADY_EXIST, data);
        }
    }

    async updateAllUsersInSubTools() {
        // TODO fix because UPDATE always sets USER_ACTIVE to true but it should not
        const updateContactsStack = new ExecutionSyncStack<
            NotificationDataTypes[NotificationType.USER_UPDATED],
            boolean
        >(
            data => notifyService.notify(NotificationType.USER_UPDATED, data),
            100, // brevo limits calls to /contacts to 10 per second so 100 per ms https://developers.brevo.com/docs/api-limits#general-rate-limiting
        );
        const users = await userPort.findAll();
        const promises: Promise<boolean>[] = [];

        for (const user of users) {
            if (user.disable) continue;

            let reset: null | UserReset = null;
            if (!user.active) {
                reset = await userResetPort.findOneByUserId(user._id);
            }

            const data = {
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName,
                agentType: user.agentType,
                jobType: user.jobType,
                region: user.region,
                url: reset ? `${FRONT_OFFICE_URL}/auth/reset-password/${reset.token}?active=true` : undefined,
                active: user.active,
                signupAt: user.signupAt,
                lastActivityDate: user.lastActivityDate,
            } as NotificationDataTypes[NotificationType.USER_UPDATED];

            promises.push(updateContactsStack.addOperation(data));
        }
        await Promise.all(promises);
    }
}

const userStatsService = new UserStatsService();
export default userStatsService;

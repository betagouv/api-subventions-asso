import { UserDto } from "dto";
import userRepository from "../../repositories/user.repository";
import UserReset from "../../entities/UserReset";
import userResetRepository from "../../repositories/user-reset.repository";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import { NotificationType } from "../../../notify/@types/NotificationType";
import notifyService from "../../../notify/notify.service";
import { NotificationDataTypes } from "../../../notify/@types/NotificationDataTypes";
import ExecutionSyncStack from "../../../../shared/ExecutionSyncStack";
import statsAssociationsVisitRepository from "../../../stats/repositories/statsAssociationsVisit.repository";
import userCrudService from "../crud/user.crud.service";
import configurationsService from "../../../configurations/configurations.service";

export class UserStatsService {
    public countTotalUsersOnDate(date, withAdmin = false) {
        return userRepository.countTotalUsersOnDate(date, withAdmin);
    }

    public findByPeriod(begin: Date, end: Date, withAdmin = false) {
        return userRepository.findByPeriod(begin, end, withAdmin);
    }

    public getUsersWithStats(): Promise<UserDto[]> {
        return userCrudService.find();
    }

    public async updateNbRequests() {
        const since = await configurationsService.getLastUserStatsUpdate();
        return this.updateNbRequestsByDate(since, new Date());
    }

    private async updateNbRequestsByDate(since?: Date, until?: Date) {
        if (!until) until = new Date();
        if (!since) {
            since = new Date();
            since.setDate(since.getDate() - 1);
        }
        const countByUser = (
            await statsAssociationsVisitRepository.findGroupedByUserIdentifierOnPeriod(since, until)
        ).map(({ _id, associationVisits }) => ({
            _id,
            count: associationVisits.length,
        }));
        await userRepository.updateNbRequests(countByUser);
        await configurationsService.setLastUserStatsUpdate(until);
    }

    async notifyAllUsersInSubTools() {
        const users = await userRepository.findAll();

        for (const user of users) {
            if (user.disable) continue;

            let reset: null | UserReset = null;
            if (!user.active) {
                reset = await userResetRepository.findOneByUserId(user._id);
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
        const users = await userRepository.findAll();
        const promises: Promise<boolean>[] = [];

        for (const user of users) {
            if (user.disable) continue;

            let reset: null | UserReset = null;
            if (!user.active) {
                reset = await userResetRepository.findOneByUserId(user._id);
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

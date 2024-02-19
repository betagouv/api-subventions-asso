import { UserWithStatsDto } from "dto";
import userRepository from "../../repositories/user.repository";
import userAssociationVisitJoiner from "../../../stats/joiners/UserAssociationVisitsJoiner";
import { getMostRecentDate } from "../../../../shared/helpers/DateHelper";
import UserReset from "../../entities/UserReset";
import userResetRepository from "../../repositories/user-reset.repository";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import { NotificationType } from "../../../notify/@types/NotificationType";
import notifyService from "../../../notify/notify.service";
import { NotificationDataTypes } from "../../../notify/@types/NotificationDataTypes";
import ExecutionSyncStack from "../../../../shared/ExecutionSyncStack";

export class UserStatsService {
    public countTotalUsersOnDate(date, withAdmin = false) {
        return userRepository.countTotalUsersOnDate(date, withAdmin);
    }

    public findByPeriod(begin: Date, end: Date, withAdmin = false) {
        return userRepository.findByPeriod(begin, end, withAdmin);
    }

    public async getUsersWithStats(includesAdmin = false): Promise<UserWithStatsDto[]> {
        const usersWithAssociationVisits = await userAssociationVisitJoiner.findUsersWithAssociationVisits(
            includesAdmin,
        );
        const userWithStats = usersWithAssociationVisits.map(user => {
            const stats = {
                lastSearchDate: getMostRecentDate(user.associationVisits.map(visit => visit.date)),
                searchCount: user.associationVisits.length,
            };
            // remove associationVisits
            const { associationVisits: _associationVisits, ...userDbo } = user;
            return { ...userDbo, stats } as UserWithStatsDto;
        });

        return userWithStats;
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

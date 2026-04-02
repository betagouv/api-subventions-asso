import { UserDto } from "dto";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import { NotificationType } from "../../../notify/@types/NotificationType";
import notifyService from "../../../notify/notify.service";
import userCrudService from "../crud/user.crud.service";
import configurationsService from "../../../configurations/configurations.service";
import statsAssociationsVisitAdapter from "../../../../adapters/outputs/db/stats/association-visit.adapter";

export class UserStatsService {
    public countTotalUsersOnDate(date, withAdmin = false) {
        return userAdapter.countTotalUsersOnDate(date, withAdmin);
    }

    public findByPeriod(begin: Date, end: Date, withAdmin = false) {
        return userAdapter.findByPeriod(begin, end, withAdmin);
    }

    public getUsersWithStats(): Promise<UserDto[]> {
        return userCrudService.find();
    }

    public async updateNbRequests() {
        const since = await configurationsService.getLastUserStatsUpdate();
        return this.updateNbRequestsByDate(since, new Date());
    }

    private async updateNbRequestsByDate(since: Date, until: Date) {
        const countByUser = (await statsAssociationsVisitAdapter.findGroupedByUserIdentifierOnPeriod(since, until)).map(
            ({ _id, associationVisits }) => ({
                _id,
                count: associationVisits.length,
            }),
        );

        await userAdapter.updateNbRequests(countByUser);
        await configurationsService.setLastUserStatsUpdate(until);

        // should we await this ? to ensure we got feedback from Brevo update ?
        const userIds = countByUser.map(userCount => userCount._id);
        await this.updateNbRequestsInBrevo(userIds);
    }

    private async updateNbRequestsInBrevo(usersId: string[]) {
        const partialUsers = (await userAdapter.findPartialUsersById(usersId, ["email", "nbVisits"])) as Pick<
            UserDto,
            "email" | "nbVisits"
        >[];

        await notifyService.notify(NotificationType.STATS_NB_REQUESTS, partialUsers);
    }
}

const userStatsService = new UserStatsService();
export default userStatsService;

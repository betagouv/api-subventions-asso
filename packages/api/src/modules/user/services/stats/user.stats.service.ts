import { UserDto } from "dto";
import userPort from "../../../../dataProviders/db/user/user.port";
import { NotificationType } from "../../../notify/@types/NotificationType";
import notifyService from "../../../notify/notify.service";
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
        const userIds = countByUser.map(userCount => userCount._id);
        await this.updateNbRequestsInBrevo(userIds);
    }

    private async updateNbRequestsInBrevo(usersId: string[]) {
        const partialUsers = (await userPort.findPartialUsersById(usersId, ["email", "nbVisits"])) as Pick<
            UserDto,
            "email" | "nbVisits"
        >[];

        await notifyService.notify(NotificationType.STATS_NB_REQUESTS, partialUsers);
    }
}

const userStatsService = new UserStatsService();
export default userStatsService;

import { UserWithStatsDto } from "dto";
import userRepository from "../../repositories/user.repository";
import userAssociationVisitJoiner from "../../../stats/joiners/UserAssociationVisitsJoiner";
import { getMostRecentDate } from "../../../../shared/helpers/DateHelper";

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
}

const userStatsService = new UserStatsService();
export default userStatsService;

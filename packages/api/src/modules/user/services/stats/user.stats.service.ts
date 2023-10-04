import userRepository from "../../repositories/user.repository";

export class UserStatsService {
    public countTotalUsersOnDate(date, withAdmin = false) {
        return userRepository.countTotalUsersOnDate(date, withAdmin);
    }

    public findByPeriod(begin: Date, end: Date, withAdmin = false) {
        return userRepository.findByPeriod(begin, end, withAdmin);
    }
}

const userStatsService = new UserStatsService();
export default userStatsService;

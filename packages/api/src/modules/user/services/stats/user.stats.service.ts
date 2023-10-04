import userRepository from "../../repositories/user.repository";

export class UserStatsService {
    public countTotalUsersOnDate(date, withAdmin = false) {
        return userRepository.countTotalUsersOnDate(date, withAdmin);
    }
}

const userStatsService = new UserStatsService();
export default userStatsService;

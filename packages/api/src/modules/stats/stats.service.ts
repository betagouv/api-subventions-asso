import statsRepository from "./repositories/statsRepository";
import { englishMonthNames, firstDayOfPeriod, oneYearAfterPeriod } from "../../shared/helpers/DateHelper";
import userService from "../user/user.service";

class StatsService {
    async getNbUsersByRequestsOnPeriod(start: Date, end: Date, minReq: number, includesAdmin: boolean) {
        return await statsRepository.countUsersByRequestNbOnPeriod(start, end, minReq, includesAdmin);
    }

    async getMedianRequestsOnPeriod(start: Date, end: Date, includesAdmin: boolean) {
        return await statsRepository.countMedianRequestsOnPeriod(start, end, includesAdmin);
    }

    async getRequestsPerMonthByYear(year: number, includesAdmin: boolean) {
        return await statsRepository.countRequestsPerMonthByYear(year, includesAdmin);
    }

    async getMonthlyUserNbByYear(year: number) {
        const start = firstDayOfPeriod(year);
        let count = await userService.countNewUsersBeforeDate(start);
        const users = await userService.findAndSortByPeriod(start, oneYearAfterPeriod(year));

        const countNewByMonth = new Array(12).fill(0);
        for (const user of users) {
            if (!user) continue;
            countNewByMonth[(user.signupAt as Date).getMonth()] += 1;
        }

        const formattedCumulatedCount = {};
        for (let month = 0; month < 12; month++) {
            count += countNewByMonth[month];
            formattedCumulatedCount[englishMonthNames[month]] = count;
        }

        return formattedCumulatedCount;
    }
}

const statsService = new StatsService();

export default statsService;

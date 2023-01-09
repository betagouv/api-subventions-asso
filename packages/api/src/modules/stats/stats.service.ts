import statsRepository from "./repositories/statsRepository";
import {
    dateToUTCMonthYear,
    englishMonthNames,
    firstDayOfPeriod,
    nextDayAfterPeriod
} from "../../shared/helpers/DateHelper";
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
        let count = await userService.countBeforeDate(start);
        const users = await userService.findAndSortByPeriod(start, nextDayAfterPeriod(year));
        const monthlyCount = {};
        let month = 0;
        for (const user of users) {
            if (!user) continue;
            while (month != (user.signupAt as Date).getMonth()) {
                monthlyCount[englishMonthNames[month]] = count;
                month += 1;
            }
            count += 1;
        }
        while (month < 12) {
            monthlyCount[englishMonthNames[month]] = count;
            month += 1;
        }
        return monthlyCount;
    }
}

const statsService = new StatsService();

export default statsService;

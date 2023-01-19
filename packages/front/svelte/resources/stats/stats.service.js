import statsPort from "./stats.port";
import { monthCapitalizedFromId } from "../../helpers/dateHelper";

export class StatsService {
    getTopAssociations(limit) {
        return statsPort.getTopAssociations(limit);
    }

    async getMonthlyUserCount(year) {
        const TODAY = new Date();
        const data = await statsPort.getMonthlyUserCount(year);
        // TODO change this with api change #908
        if (year === TODAY.getFullYear()) {
            for (let month = TODAY.getMonth() + 1; month < 12; month++) data[monthCapitalizedFromId(month)] = null;
        }
        return data;
    }

    getUsersDistribution() {
        return statsPort.getUsersDistribution();
    }
}

const statsService = new StatsService();
export default statsService;

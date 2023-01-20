import statsPort from "./stats.port";
import { monthCapitalizedFromId } from "../../helpers/dateHelper";

export class StatsService {
    getTopAssociations(limit) {
        return statsPort.getTopAssociations(limit);
    }

    async getMonthlyUserCount(year) {
        return statsPort.getMonthlyUserCount(year);
    }

    getUsersDistribution() {
        return statsPort.getUsersDistribution();
    }
}

const statsService = new StatsService();
export default statsService;

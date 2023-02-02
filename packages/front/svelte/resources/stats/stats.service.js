import statsPort from "./stats.port";
import statsAdapter from "@resources/stats/stats.adapter";

export class StatsService {
    getTopAssociations(limit) {
        return statsPort.getTopAssociations(limit);
    }

    async getMonthlyUserCount(year) {
        const rawData = await statsPort.getMonthlyUserCount(year);
        return statsAdapter.formatUserCount(rawData);
    }

    getUsersDistribution() {
        return statsPort.getUsersDistribution();
    }

    async getMonthlyRequestCount(year) {
        const rawData = await statsPort.getMonthlyRequestCount(year);
        return statsAdapter.formatRequestCount(rawData);
    }
}

const statsService = new StatsService();
export default statsService;

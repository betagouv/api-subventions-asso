import statsPort from "./stats.port";

export class StatsService {
    getTopAssociations(limit) {
        return statsPort.getTopAssociations(limit);
    }

    getMonthlyUserCount(year) {
        return statsPort.getMonthlyUserCount(year);
    }

    getUsersDistribution() {
        return statsPort.getUsersDistribution();
    }

    getMonthlyRequestCount(year) {
        return statsPort.getMonthlyRequestCount(year);
    }
}

const statsService = new StatsService();
export default statsService;

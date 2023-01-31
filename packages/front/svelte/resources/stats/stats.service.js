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
}

const statsService = new StatsService();
export default statsService;

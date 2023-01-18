import statsPort from "./stats.port";

export class StatsService {
    getTopAssociations(limit) {
        return statsPort.getTopAssociations(limit);
    }
}

const statsService = new StatsService();

export default statsService;

import statisticsPort from "./statistics.port";

export class StatisticsService {
    getTopAssociations(limit) {
        return statisticsPort.getTopAssociations(limit);
    }
}

const statisticsService = new StatisticsService();

export default statisticsService;

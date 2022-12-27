import statisticsPort from "./statistics.port";

export class StatisticsService {
    getTopAssociations(limit, startDate, endDate) {
        return statisticsPort.getTopAssociations(limit, startDate, endDate);
    }
}

const statisticsService = new StatisticsService();

export default statisticsService;

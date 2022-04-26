import statsRepository from './repositories/statsRepository';

class StatsService {
    async getNbUsersByRequestsOnPeriod(start: Date, end: Date, minReq: number) {
        return await statsRepository.countUsersByRequestNbOnPeriod(start, end, minReq)
    }
}

const statsService = new StatsService();

export default statsService;
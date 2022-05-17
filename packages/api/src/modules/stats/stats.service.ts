import statsRepository from './repositories/statsRepository';

class StatsService {
    async getNbUsersByRequestsOnPeriod(start: Date, end: Date, minReq: number, includesAdmin: boolean) {
        return await statsRepository.countUsersByRequestNbOnPeriod(start, end, minReq, includesAdmin)
    }
}

const statsService = new StatsService();

export default statsService;
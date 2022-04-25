import { formatTimestamp, getYMDFromISO } from '../../shared/helpers/DateHelper';
import statsRepository from './repositories/statsRepository';

class StatsService {
    async getNbUsersByRequestsOnPeriod(start: string, end: string, minReq: string) {
        start = getYMDFromISO(formatTimestamp(start));
        end = getYMDFromISO(formatTimestamp(end));
        return await statsRepository.countUsersByRequestNbOnPeriod(start, end, minReq)
    }
}

const statsService = new StatsService();

export default statsService;
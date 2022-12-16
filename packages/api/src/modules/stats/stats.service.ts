import statsRepository from "./repositories/statsRepository";
import assoVisitsRepository from "./repositories/associationVisits.repository";
import { Association } from "@api-subventions-asso/dto";

class StatsService {
    getNbUsersByRequestsOnPeriod(start: Date, end: Date, minReq: number, includesAdmin: boolean) {
        return statsRepository.countUsersByRequestNbOnPeriod(start, end, minReq, includesAdmin);
    }

    getMedianRequestsOnPeriod(start: Date, end: Date, includesAdmin: boolean) {
        return statsRepository.countMedianRequestsOnPeriod(start, end, includesAdmin);
    }

    getRequestsPerMonthByYear(year: number, includesAdmin: boolean) {
        return statsRepository.countRequestsPerMonthByYear(year, includesAdmin);
    }

    registerRequest(association: Association) {
        const name = association?.denomination_rna?.[0]?.value || association?.denomination_siren?.[0]?.value;
        if (!name)
            return console.warn("no association name, so the request is not counted in association top visits stats");
        const NOW = new Date();
        const monthYear = new Date(NOW.getFullYear(), NOW.getMonth(), 1);
        return assoVisitsRepository.updateAssoVisitCountByIncrement(name, monthYear);
    }

    getTopAssociationsByPeriod(limit: number, start: Date | undefined, end: Date | undefined) {
        const TODAY = new Date();
        if (!end) end = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
        if (!start) start = new Date(end.getFullYear() - 1, end.getMonth() + 1, 1);
        return assoVisitsRepository.selectMostRequestedAssosByPeriod(limit, start, end);
    }
}

const statsService = new StatsService();

export default statsService;

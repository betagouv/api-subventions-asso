import statsRepository from "./repositories/statsRepository";
import assoVisitsRepository from "./repositories/associationVisits.repository";
import { Association } from "@api-subventions-asso/dto";

class StatsService {
    async getNbUsersByRequestsOnPeriod(start: Date, end: Date, minReq: number, includesAdmin: boolean) {
        return await statsRepository.countUsersByRequestNbOnPeriod(start, end, minReq, includesAdmin);
    }

    async getMedianRequestsOnPeriod(start: Date, end: Date, includesAdmin: boolean) {
        return await statsRepository.countMedianRequestsOnPeriod(start, end, includesAdmin);
    }

    async getRequestsPerMonthByYear(year: number, includesAdmin: boolean) {
        return await statsRepository.countRequestsPerMonthByYear(year, includesAdmin);
    }

    registerRequest(association: Association) {
        const name = association?.denomination_rna?.[0]?.value || association?.denomination_siren?.[0]?.value;
        if (!name)
            return console.warn("no association name, so the request is not counted in association top visits stats");
        return assoVisitsRepository.updateAssoVisitCountByIncrement(name);
    }

    getTopAssociations(limit: number) {
        return assoVisitsRepository.selectMostRequestedAssos(limit);
    }
}

const statsService = new StatsService();

export default statsService;

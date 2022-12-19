import statsRepository from "./repositories/statsRepository";
import userRepository from "../user/repositories/user.repository";
import assoVisitsRepository from "./repositories/associationVisits.repository";
import { Association } from "@api-subventions-asso/dto";
import { dateToUTCMonthYear } from "../../shared/helpers/DateHelper";

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
        const monthYear = dateToUTCMonthYear(new Date());
        return assoVisitsRepository.updateAssoVisitCountByIncrement(name, monthYear);
    }

    getTopAssociationsByPeriod(limit = 5, start: Date | undefined = undefined, end: Date | undefined = undefined) {
        const TODAY = new Date();
        if (!end) end = TODAY;
        end = dateToUTCMonthYear(end);
        if (!start) start = new Date(Date.UTC(end.getFullYear() - 1, end.getMonth() + 1, 1));
        start = dateToUTCMonthYear(start);
        return assoVisitsRepository.selectMostRequestedAssosByPeriod(limit, start, end);
    }

    async getMonthlyUserNbByYear(year: number) {
        return await userRepository.getMonthlyNbByYear(year);
    }
}

const statsService = new StatsService();

export default statsService;

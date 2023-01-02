import statsRepository from "./repositories/statsRepository";
import assoVisitsRepository from "./repositories/associationVisits.repository";
import { Association, AssociationTop } from "@api-subventions-asso/dto";
import { dateToUTCMonthYear } from "../../shared/helpers/DateHelper";
import associationNameService from "../association-name/associationName.service";

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
        // TODO remove by name and call repo with {rna, siren}
        if (!name)
            return console.warn("no association name, so the request is not counted in association top visits stats");
        const monthYear = dateToUTCMonthYear(new Date());
        return assoVisitsRepository.updateAssoVisitCountByIncrement(name, monthYear);
    }

    async getTopAssociationsByPeriod(
        limit = 5,
        start: Date | undefined = undefined,
        end: Date | undefined = undefined
    ): Promise<AssociationTop[]> {
        const TODAY = new Date();
        if (!end) end = TODAY;
        end = dateToUTCMonthYear(end);
        if (!start) start = new Date(Date.UTC(end.getFullYear() - 1, end.getMonth() + 1, 1));
        start = dateToUTCMonthYear(start);
        const queryResult = await assoVisitsRepository.selectMostRequestedAssosByPeriod(limit, start, end);
        const promises = queryResult.map(async logCount => ({
            name: await associationNameService.getNameFromIdentifier(logCount._id?.rna || logCount._id?.siren),
            nbRequests: logCount.nbRequests as number
        }));
        return (await Promise.all(promises)).filter(topItem => !!topItem.name) as AssociationTop[];
    }
}

const statsService = new StatsService();

export default statsService;

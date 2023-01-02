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
        const identifier = { rna: association.rna?.[0]?.value, siren: association?.siren?.[0]?.value };
        const monthYear = dateToUTCMonthYear(new Date());
        return assoVisitsRepository.updateAssoVisitCountByIncrement(identifier, monthYear);
    }

    async getTopAssociationsByPeriod(
        limit = 5,
        start: Date | undefined = undefined,
        end: Date | undefined = undefined
    ): Promise<AssociationTop[]> {
        const TODAY = new Date();
        if (!end) end = TODAY;
        if (!start) start = new Date(Date.UTC(end.getFullYear() - 1, end.getMonth() + 1, 1));
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

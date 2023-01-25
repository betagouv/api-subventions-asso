import { englishMonthNames, firstDayOfPeriod, oneYearAfterPeriod, isValidDate } from "../../shared/helpers/DateHelper";
import userService from "../user/user.service";
import statsRepository from "./repositories/stats.repository";
import { BadRequestError } from "../../shared/errors/httpErrors/BadRequestError";
import statsAssociationsVisitRepository from "./repositories/statsAssociationsVisit.repository";
import { AssociationIdentifiers } from "../../@types";
import AssociationVisitEntity from "./entities/AssociationVisitEntity";
import { asyncForEach } from "../../shared/helpers/ArrayHelper";
import associationNameService from "../association-name/associationName.service";
import userRepository from "../user/repositories/user.repository";
import { RoleEnum } from "../../@enums/Roles";
import UserDbo from "../user/repositories/dbo/UserDbo";
import { WithId } from "mongodb";
import { UserCountByStatus } from "@api-subventions-asso/dto";
import { isUserActif } from "../../shared/helpers/UserHelper";

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

    async getMonthlyUserNbByYear(year: number) {
        const start = firstDayOfPeriod(year);
        let count = await userService.countTotalUsersOnDate(start);
        const users = await userService.findByPeriod(start, oneYearAfterPeriod(year));

        const countNewByMonth = new Array(12).fill(0);

        for (const user of users) {
            if (!user) continue;
            countNewByMonth[(user.signupAt as Date).getMonth()] += 1;
        }

        return {
            nombres_utilisateurs_avant_annee: count,
            evolution_nombres_utilisateurs: countNewByMonth.reduce((acc, month, index) => {
                const totalUsersOnMonth = month + (acc[index - 1] || count);
                acc[index] = totalUsersOnMonth;
                return acc;
            }, [])
        };
    }

    private async groupVisitsOnMaps(group, rnaMap, sirenMap) {
        if (rnaMap.has(group._id) || sirenMap.has(group._id)) {
            const mapVisits = rnaMap.get(group._id) || sirenMap.get(group._id);
            mapVisits?.visits.push(...group.visits);
            return;
        }
        const identifiers = await associationNameService.getGroupedIdentifiers(group._id);
        const associationVisits = {
            id: group._id,
            visits: [] as AssociationVisitEntity[]
        };

        associationVisits.visits.push(...group.visits);

        if (identifiers.rna) rnaMap.set(identifiers.rna, associationVisits);
        if (identifiers.siren) sirenMap.set(identifiers.siren, associationVisits);
    }

    private async groupAssociationVisitsByAssociation(visits: { _id: string; visits: AssociationVisitEntity[] }[]) {
        // Group by association, same association but different identifier
        const rnaMap: Map<AssociationIdentifiers, { id: AssociationIdentifiers; visits: AssociationVisitEntity[] }> =
            new Map();
        const sirenMap: Map<AssociationIdentifiers, { id: AssociationIdentifiers; visits: AssociationVisitEntity[] }> =
            new Map();

        await asyncForEach(visits, async group => this.groupVisitsOnMaps(group, rnaMap, sirenMap));

        return [...new Set([...rnaMap.values(), ...sirenMap.values()])];
    }

    private keepOneVisitByUserAndDate(visits) {
        const sortedVisitsMap = visits.reduce((acc, visit) => {
            const id = `${visit.userId}-${visit.date.getFullYear()}-${visit.date.getMonth()}-${visit.date.getDate()}`;
            return acc.set(id, visit);
        }, new Map());

        return [...sortedVisitsMap.values()];
    }

    async getTopAssociationsByPeriod(limit: number, start: Date, end: Date) {
        if (!start || !isValidDate(start) || !end || !isValidDate(end)) throw new BadRequestError("Invalid Date");

        const visitsGroupedByAssociationIdentifier =
            await statsAssociationsVisitRepository.findGroupedByAssociationIdentifierOnPeriod(start, end);
        const visitsGroupedByAssociation = await this.groupAssociationVisitsByAssociation(
            visitsGroupedByAssociationIdentifier
        );

        const countVisitByAssociationDesc = visitsGroupedByAssociation
            .map(associationVisit => ({
                id: associationVisit.id,
                visits: this.keepOneVisitByUserAndDate(associationVisit.visits).length
            }))
            .sort((a, b) => b.visits - a.visits);

        const topAssociationsAsc = countVisitByAssociationDesc.slice(0, limit);

        const getAssociationName = async id => (await associationNameService.getNameFromIdentifier(id)) || id;
        const namedTopAssociations = topAssociationsAsc.reduce(async (acc, topAssociation) => {
            const result = await acc;
            return result.concat({
                name: await getAssociationName(topAssociation.id),
                visits: topAssociation.visits
            });
        }, Promise.resolve([]) as Promise<{ name: string; visits: number }[]>);

        return namedTopAssociations;
    }

    addAssociationVisit(visit: AssociationVisitEntity) {
        return statsAssociationsVisitRepository.add(visit);
    }

    private reduceUsersToUsersByStatus(usersByStatus: UserCountByStatus, user: WithId<UserDbo>) {
        if (user.roles.includes(RoleEnum.admin)) usersByStatus.admin++;
        else if (isUserActif(user)) usersByStatus.active++;
        else if (user.active) usersByStatus.idle++;
        else usersByStatus.inactive++;
        return usersByStatus;
    }

    async getUserCountByStatus() {
        const users = await userRepository.findAll();
        return users.reduce(this.reduceUsersToUsersByStatus, {
            admin: 0,
            active: 0,
            idle: 0,
            inactive: 0
        });
    }
}

const statsService = new StatsService();

export default statsService;

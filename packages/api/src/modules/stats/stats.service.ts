import { WithId } from "mongodb";
import { UserCountByStatus } from "@api-subventions-asso/dto";
import { firstDayOfPeriod, isValidDate, oneYearAfterPeriod } from "../../shared/helpers/DateHelper";
import userService from "../user/user.service";
import { BadRequestError } from "../../shared/errors/httpErrors";
import { AssociationIdentifiers } from "../../@types";
import { asyncForEach } from "../../shared/helpers/ArrayHelper";
import associationNameService from "../association-name/associationName.service";
import userRepository from "../user/repositories/user.repository";
import { RoleEnum } from "../../@enums/Roles";
import UserDbo from "../user/repositories/dbo/UserDbo";
import { isUserActif } from "../../shared/helpers/UserHelper";
import * as DateHelper from "../../shared/helpers/DateHelper";
import userAssociationVisitJoiner from "./joiners/UserAssociationVisitsJoiner";
import { UserWithAssociationVisitsEntity } from "./entities/UserWithAssociationVisitsEntity";
import AssociationVisitEntity from "./entities/AssociationVisitEntity";
import statsAssociationsVisitRepository from "./repositories/statsAssociationsVisit.repository";
import statsRepository from "./repositories/stats.repository";

class StatsService {
    async getNbUsersByRequestsOnPeriod(start: Date, end: Date, minReq: number) {
        const users = await userAssociationVisitJoiner.findAssociationVisitsOnPeriodGroupedByUsers(start, end);
        const filteredUsers = users.filter(user => user.associationVisits.length >= minReq);
        return filteredUsers.length;
    }

    async getMedianVisitsOnPeriod(start: Date, end: Date) {
        if (!start || !isValidDate(start) || !end || !isValidDate(end)) throw new BadRequestError("Invalid Date");

        /* 
        this does not calculate the "true" median, but is the historic computation
        true median computation should include users with 0 requests
        use `userAssociationVisitJoiner.findAssociationVisitsOnPeriodGroupedByUsers`
        instead of statsAssociationsVisitRepository.findGroupedByUserIdentifierOnPeriod
        if we need to have a more realistic median
        */
        const visitsGroupedByUser = await statsAssociationsVisitRepository.findGroupedByUserIdentifierOnPeriod(
            start,
            end,
        );

        const uniqueVisitsByUserDesc = (
            await Promise.all(
                visitsGroupedByUser.map(
                    async userVisits =>
                        (
                            await this.keepOneUserVisitByAssociationAndDate(userVisits.associationVisits)
                        ).length,
                ),
            )
        ).sort((a, b) => b - a);

        if (!uniqueVisitsByUserDesc.length) return 0;
        const middle = Math.floor(uniqueVisitsByUserDesc.length / 2);

        if (uniqueVisitsByUserDesc.length % 2 === 0) {
            return (uniqueVisitsByUserDesc[middle - 1] + uniqueVisitsByUserDesc[middle]) / 2;
        }

        return uniqueVisitsByUserDesc[middle];
    }

    async getRequestsPerMonthByYear(year: number, includesAdmin: boolean) {
        const now = new Date();
        if (year > now.getFullYear())
            return {
                nb_requetes_par_mois: [],
                nb_requetes_moyen: 0,
                somme_nb_requetes: 0,
            };
        const lastMonthIndex1 = now.getFullYear() === year ? now.getMonth() + 1 : 12;

        const countAsObjectIndex1 = await statsRepository.countRequestsPerMonthByYear(year, includesAdmin);
        const { countAsArray, sum } = countAsObjectIndex1.reduce(
            (acc, { _id: monthIdIndex1, nbOfRequests }) => {
                acc.countAsArray[monthIdIndex1 - 1] = nbOfRequests;
                acc.sum += nbOfRequests;
                return acc;
            },
            { countAsArray: Array(12).fill(0), sum: 0 },
        );
        countAsArray.splice(lastMonthIndex1);

        return {
            nb_requetes_par_mois: countAsArray,
            nb_requetes_moyen: sum / lastMonthIndex1,
            somme_nb_requetes: sum,
        };
    }

    async getMonthlyUserNbByYear(year: number) {
        const start = firstDayOfPeriod(year);
        const init_count = await userService.countTotalUsersOnDate(start);
        const users = await userService.findByPeriod(start, oneYearAfterPeriod(year));

        const now = new Date();
        const lastMonth = now.getFullYear() === year ? now.getMonth() + 1 : now.getFullYear() < year ? 0 : 12;
        const countNewByMonth = new Array(12).fill(0);

        for (const user of users) {
            if (!user) continue;
            countNewByMonth[(user.signupAt as Date).getMonth()] += 1;
        }

        return {
            nombres_utilisateurs_avant_annee: init_count,
            evolution_nombres_utilisateurs: countNewByMonth
                .reduce((acc, month, index) => {
                    acc[index] = month + (acc[index - 1] || init_count);
                    return acc;
                }, [])
                .slice(0, lastMonth),
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
            visits: [] as AssociationVisitEntity[],
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

    private async keepOneUserVisitByAssociationAndDate(visits: AssociationVisitEntity[]) {
        if (!visits.length) return [];
        const visitsByAssociations = await this.groupAssociationVisitsByAssociation(
            visits.map(v => ({ _id: v.associationIdentifier, visits: [v] })),
        );

        const visitsMaps = visitsByAssociations
            .map(visitsByAssociation => {
                return visitsByAssociation.visits.reduce(
                    (acc, visit) =>
                        acc.set(`${visit.date.getFullYear()}-${visit.date.getMonth()}-${visit.date.getDate()}`, visit),
                    new Map(),
                );
            })
            .flat();

        return [...visitsMaps.values()];
    }

    async getTopAssociationsByPeriod(limit: number, start: Date, end: Date) {
        if (!start || !isValidDate(start) || !end || !isValidDate(end)) throw new BadRequestError("Invalid Date");

        const visitsGroupedByAssociationIdentifier =
            await statsAssociationsVisitRepository.findGroupedByAssociationIdentifierOnPeriod(start, end);
        const visitsGroupedByAssociation = await this.groupAssociationVisitsByAssociation(
            visitsGroupedByAssociationIdentifier,
        );

        const countVisitByAssociationDesc = visitsGroupedByAssociation
            .map(associationVisit => ({
                id: associationVisit.id,
                visits: this.keepOneVisitByUserAndDate(associationVisit.visits).length,
            }))
            .sort((a, b) => b.visits - a.visits);

        const topAssociationsAsc = countVisitByAssociationDesc.slice(0, limit);

        const getAssociationName = async id => (await associationNameService.getNameFromIdentifier(id)) || id;
        const namedTopAssociations = topAssociationsAsc.reduce(async (acc, topAssociation) => {
            const result = await acc;
            return result.concat({
                name: await getAssociationName(topAssociation.id),
                visits: topAssociation.visits,
            });
        }, Promise.resolve([]) as Promise<{ name: string; visits: number }[]>);

        return namedTopAssociations;
    }

    addAssociationVisit(visit: AssociationVisitEntity) {
        return statsAssociationsVisitRepository.add(visit);
    }

    private async reduceUsersToUsersByStatus(acc: Promise<UserCountByStatus>, user: WithId<UserDbo>) {
        const usersByStatus = await acc;
        if (user.roles.includes(RoleEnum.admin)) usersByStatus.admin++;
        else if (await isUserActif(user)) usersByStatus.active++;
        else if (user.active) usersByStatus.idle++;
        else usersByStatus.inactive++;
        return usersByStatus;
    }

    async getUserCountByStatus() {
        const users = await userRepository.findAll();
        return users.reduce(
            this.reduceUsersToUsersByStatus,
            Promise.resolve({
                admin: 0,
                active: 0,
                idle: 0,
                inactive: 0,
            }),
        );
    }

    private async countUserAverageVisitsOnPeriod(user: UserWithAssociationVisitsEntity, start: Date, end: Date) {
        const userStartDate = start.getTime() > user.signupAt.getTime() ? start : user.signupAt;

        const visitsAssociation = await this.keepOneUserVisitByAssociationAndDate(user.associationVisits);
        const months = DateHelper.computeMonthBetweenDates(userStartDate, end);

        return visitsAssociation.length / months;
    }

    async getUsersByRequest() {
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth());
        const start = new Date(end.getFullYear() - 1, end.getMonth());

        const usersWithAssociationVisits = await userAssociationVisitJoiner.findAssociationVisitsOnPeriodGroupedByUsers(
            start,
            end,
        );

        const result = await usersWithAssociationVisits.reduce(async (acc, user) => {
            if (!user) return acc;
            const data = await acc;
            const averageVisits = await this.countUserAverageVisitsOnPeriod(user, start, end);

            if (averageVisits < 1) {
                data[":0"] += 1;
            } else if (averageVisits < 11) {
                data["1:10"] += 1;
            } else if (averageVisits < 21) {
                data["11:20"] += 1;
            } else if (averageVisits < 31) {
                data["21:30"] += 1;
            } else {
                data["31:"] += 1;
            }
            return data;
        }, Promise.resolve({ ":0": 0, "1:10": 0, "11:20": 0, "21:30": 0, "31:": 0 }));

        return {
            debut_periode: start,
            fin_periode: end,
            ...result,
        };
    }

    async getExportersEmails() {
        const logs = await statsRepository.getLogsWithRegexUrl(/extract-data$/).toArray();
        const emailSet = new Set(logs.map(log => log?.meta?.req?.user?.email).filter(email => !!email));
        return [...emailSet];
    }

    async getUserLastSearchDate(userId) {
        return statsAssociationsVisitRepository.getLastSearchDate(userId);
    }

    getAllVisitsUser(userId: string) {
        return statsAssociationsVisitRepository.findByUserId(userId);
    }

    getAllLogUser(email: string) {
        return statsRepository.findByEmail(email);
    }
}

const statsService = new StatsService();

export default statsService;

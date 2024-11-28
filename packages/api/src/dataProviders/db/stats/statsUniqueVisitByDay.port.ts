import MongoRepository from "../../../shared/MongoRepository";
import AssociationVisitEntity from "../../../modules/stats/entities/AssociationVisitEntity";
import statsAssociationsVisitRepository from "./statsAssociationsVisit.port";

export const groupVisitByUser = (result, visit) => {
    const name = visit.userId;
    const group = result[name] || (result[name] = []);
    group.push(visit);
    return result;
};

export const keepOneUserVisitByDay = userVisits => {
    const yourDate = new Date();
    yourDate.toISOString().split("T")[0];

    return userVisits.reduce((result, visit) => {
        // assume that user do requests between 8am and 18pm and do not care about timezone (possibly -2 hours on the server)
        const date = new Date(visit.date).toISOString().split("T")[0];
        // keep first visit we find, we do not care about time of the day
        if (!result[date]) result[date] = visit;
        return result;
    }, {});
};

export class StatsUniqueVisitByDay extends MongoRepository<AssociationVisitEntity> {
    public collectionName = "stats-unique-visit-by-day";

    public createIndexes(): void {
        // no indexes needed
        return;
    }

    _reduceToOneVisitByDayByUser(visitsByAssociation) {
        /**
         * array of associations visits grouped ny day
         * [
         *  {
         *      identifier: 'W332028031',
         *      visits: [ { '2023-03-16': AssociationVisitEntity[] }, { '2023-04-05': AssociationVisitEntity[] } ]
         *  },
         *  {}...
         * ]
         */
        const uniqueVisitByDay = visitsByAssociation.map(associationVisits => {
            const visitsGroupByUser = associationVisits.visits.reduce(groupVisitByUser, {});
            return Object.values(visitsGroupByUser).map(keepOneUserVisitByDay);
        });

        return uniqueVisitByDay
            .flat()
            .map(visitsByDay => Object.values(visitsByDay))
            .flat() as AssociationVisitEntity[];
    }

    public async createCollectionFromStatsAssociationVisits() {
        const visitsByAssociation = await statsAssociationsVisitRepository.findGroupedByAssociationIdentifier();
        const visits = this._reduceToOneVisitByDayByUser(visitsByAssociation);
        await this.collection.insertMany(visits);
    }
}

const statsUniqueVisitByDay = new StatsUniqueVisitByDay();
export default statsUniqueVisitByDay;

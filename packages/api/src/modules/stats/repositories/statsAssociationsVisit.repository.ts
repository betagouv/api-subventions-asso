import { AssociationIdentifiers, DefaultObject } from "../../../@types";
import MigrationRepository from "../../../shared/MigrationRepository";
import AssociationVisitEntity from "../entities/AssociationVisitEntity";
import { RoleEnum } from "../../../@enums/Roles";

export class StatsAssociationsVisitRepository extends MigrationRepository<AssociationVisitEntity> {
    collectionName = "stats-association-visits";

    joinIndexes = {
        user: "userId",
    };

    async add(entity: AssociationVisitEntity) {
        await this.collection.insertOne(entity);
        return true;
    }

    async createIndexes() {
        await this.collection.createIndex({ date: 1 });
        await this.collection.createIndex({ associationIdentifier: 1 });
        await this.collection.createIndex({ userId: 1 });
    }

    findGroupedByAssociationIdentifierOnPeriod(start: Date, end: Date) {
        return this.collection
            .aggregate([
                {
                    $match: {
                        date: {
                            $gte: start,
                            $lte: end,
                        },
                    },
                },
                {
                    $group: {
                        _id: "$associationIdentifier",
                        visits: { $addToSet: "$$ROOT" },
                    },
                },
            ])
            .toArray() as Promise<{ _id: AssociationIdentifiers; visits: AssociationVisitEntity[] }[]>;
    }

    public countVisitsPerMonthByYear(year: number) {
        // TODO use stats-association-visits, rename, adapt tests
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 0);
        const buildQuery = () => {
            const matchQuery: { $match: DefaultObject } = {
                $match: {
                    date: {
                        $gte: start,
                        $lte: end,
                    },
                },
            };

            return [matchQuery, { $group: { _id: { $month: "$date" }, nbOfVisits: { $sum: 1 } } }];
        };

        return this.collection.aggregate(buildQuery()).toArray();
    }
}

const statsAssociationsVisitRepository = new StatsAssociationsVisitRepository();

export default statsAssociationsVisitRepository;

import { ObjectId } from "mongodb";
import { AssociationIdentifiers } from "../../../@types";
import MigrationRepository from "../../../shared/MigrationRepository";
import AssociationVisitEntity from "../entities/AssociationVisitEntity";

export class StatsAssociationsVisitRepository extends MigrationRepository<AssociationVisitEntity> {
    collectionName = "stats-association-visits";

    joinIndexes = {
        user: "userId"
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
                            $lte: end
                        }
                    }
                },
                {
                    $group: {
                        _id: "$associationIdentifier",
                        visits: { $addToSet: "$$ROOT" }
                    }
                }
            ])
            .toArray() as Promise<{ _id: AssociationIdentifiers; visits: AssociationVisitEntity[] }[]>;
    }
}

const statsAssociationsVisitRepository = new StatsAssociationsVisitRepository();

export default statsAssociationsVisitRepository;

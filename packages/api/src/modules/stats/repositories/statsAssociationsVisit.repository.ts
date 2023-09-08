import { ObjectId } from "mongodb";
import { AssociationIdentifiers } from "../../../@types";
import MigrationRepository from "../../../shared/MigrationRepository";
import AssociationVisitEntity from "../entities/AssociationVisitEntity";

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

    async getLastSearchDate(userId) {
        const result = await this.collection.find({ userId }).sort({ date: -1 }).toArray();
        if (!result.length) return null;
        return result[0].date;
    }

    _getGroupByAssociationIdentifierMatcher() {
        return {
            $group: {
                _id: "$associationIdentifier",
                visits: { $addToSet: "$$ROOT" },
            },
        };
    }

    findGroupedByAssociationIdentifier() {
        return this.collection.aggregate([this._getGroupByAssociationIdentifierMatcher()]).toArray() as Promise<
            { _id: AssociationIdentifiers; visits: AssociationVisitEntity[] }[]
        >;
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
                this._getGroupByAssociationIdentifierMatcher(),
            ])
            .toArray() as Promise<{ _id: AssociationIdentifiers; visits: AssociationVisitEntity[] }[]>;
    }

    findGroupedByUserIdentifierOnPeriod(start: Date, end: Date) {
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
                        _id: "$userId",
                        associationVisits: { $addToSet: "$$ROOT" },
                    },
                },
            ])
            .toArray() as Promise<{ _id: AssociationIdentifiers; associationVisits: AssociationVisitEntity[] }[]>;
    }

    findByUserId(userId: string) {
        return this.collection.find({ userId: new ObjectId(userId) }).toArray();
    }

    findOnPeriod(start: Date, end: Date) {
        return this.collection
            .find({
                date: {
                    $gte: start,
                    $lte: end,
                },
            })
            .toArray();
    }
}

const statsAssociationsVisitRepository = new StatsAssociationsVisitRepository();

export default statsAssociationsVisitRepository;

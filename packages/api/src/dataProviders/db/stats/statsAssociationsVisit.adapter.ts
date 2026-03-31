import { ObjectId } from "mongodb";
import MongoAdapter from "../MongoAdapter";
import AssociationVisitEntity from "../../../modules/stats/entities/AssociationVisitEntity";
import { StatsAssociationVisitPort } from "./stats-association-visit.port";

export class StatsAssociationsVisitAdapter
    extends MongoAdapter<AssociationVisitEntity>
    implements StatsAssociationVisitPort
{
    collectionName = "stats-association-visits";

    joinIndexes = {
        user: "userId",
    };

    async add(entity: AssociationVisitEntity): Promise<void> {
        await this.collection.insertOne(entity);
    }

    async createIndexes() {
        await this.collection.createIndex({ date: 1 });
        await this.collection.createIndex({ associationIdentifier: 1 });
        await this.collection.createIndex({ userId: 1 });
    }

    async getLastSearchDate(userId): Promise<Date | null> {
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

    findGroupedByAssociationIdentifier(): Promise<{ _id: string; visits: AssociationVisitEntity[] }[]> {
        return this.collection.aggregate([this._getGroupByAssociationIdentifierMatcher()]).toArray() as Promise<
            { _id: string; visits: AssociationVisitEntity[] }[]
        >;
    }

    async findGroupedByAssociationIdentifierOnPeriod(start: Date, end: Date) {
        const result = (await this.collection
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
            .toArray()) as { _id: ObjectId; visits: AssociationVisitEntity[] }[];
        return result.map(document => ({ ...document, _id: document._id.toString() }));
    }

    async findGroupedByUserIdentifierOnPeriod(
        start: Date,
        end: Date,
    ): Promise<{ _id: string; associationVisits: AssociationVisitEntity[] }[]> {
        const result = (await this.collection
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
            .toArray()) as { _id: ObjectId; associationVisits: AssociationVisitEntity[] }[];
        return result.map(document => ({ ...document, _id: document._id.toString() }));
    }

    findByUserId(userId: string): Promise<AssociationVisitEntity[]> {
        return this.collection.find({ userId: new ObjectId(userId) }).toArray();
    }

    findOnPeriod(start: Date, end: Date): Promise<AssociationVisitEntity[]> {
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

const statsAssociationsVisitAdapter = new StatsAssociationsVisitAdapter();

export default statsAssociationsVisitAdapter;

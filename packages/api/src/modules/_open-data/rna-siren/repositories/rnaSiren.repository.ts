import { Siren, Rna } from "dto";
import { ObjectId } from "mongodb";
import RnaSiren from ".././entities/RnaSirenEntity";
import MongoRepository from "../../../../shared/MongoRepository";

export class RnaSirenRepository extends MongoRepository<RnaSiren> {
    collectionName = "rna-siren";

    findById(id: ObjectId) {
        return this.collection.findOne({ _id: id });
    }

    findBySiren(siren: Siren) {
        return this.collection.findOne({ siren });
    }

    findByRna(rna: Rna) {
        return this.collection.findOne({ rna });
    }

    async create(entity: RnaSiren) {
        return !!(await this.collection.insertOne(entity));
    }

    async insertMany(entities: RnaSiren[]) {
        return this.collection.insertMany(entities, { ordered: false });
    }

    async cleanDuplicate() {
        const duplicates: ObjectId[] = [];

        await this.collection
            .aggregate(
                [
                    { $match: {} }, // Find all entities
                    {
                        $group: {
                            // Group by rna
                            _id: { rna: "$rna" },
                            dups: { $addToSet: "$_id" },
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $match: {
                            // Keep just groups to have length > 1
                            count: { $gt: 1 },
                        },
                    },
                ],
                { allowDiskUse: true }, // For faster processing if set is larger
            )
            .forEach(doc => {
                doc.dups.shift(); // First element skipped for deleting
                duplicates.push(...doc.dups);
            });

        // Remove all duplicates in one go
        await this.collection.deleteMany({ _id: { $in: duplicates } });
    }

    async createIndexes() {
        await this.collection.createIndex({ rna: 1 });
        await this.collection.createIndex({ siren: 1 });
    }
}

const rnaSirenRepository = new RnaSirenRepository();

export default rnaSirenRepository;

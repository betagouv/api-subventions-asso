
import RnaSiren from ".././entities/RnaSirenEntity";
import db from "../../../../shared/MongoConnection";
import { Siren, Rna } from "@api-subventions-asso/dto";
import { ObjectId } from "mongodb";

export class RnaSirenRepository {
    private readonly collection = db.collection<RnaSiren>("rna-siren");

    findById(id: ObjectId) {
        return this.collection.findOne({ "_id": id});
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
        return this.collection.insertMany(entities, {ordered: false});
    }

    async cleanDuplicate() {
        const duplicates: ObjectId[] = [];

        await this.collection.aggregate(
            [
                { $match: {}}, // Find all entities
                { $group: { // Group by rna 
                    _id: { rna: "$rna"},
                    dups: { "$addToSet": "$_id" }, 
                    count: { "$sum": 1 } 
                }},
                { $match: {  // Keep just groups to have length > 1
                    count: { "$gt": 1 }
                }}
            ],
            {allowDiskUse: true } // For faster processing if set is larger
        ).forEach((doc) => {
            doc.dups.shift(); // First element skipped for deleting
            duplicates.push(...doc.dups);
        });

        // Remove all duplicates in one go
        await this.collection.deleteMany({ _id: { $in: duplicates } })
    }

}

const rnaSirenRepository = new RnaSirenRepository();

export default rnaSirenRepository;
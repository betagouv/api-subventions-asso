import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import MongoAdapter from "../MongoAdapter";
import Siren from "../../../../identifier-objects/Siren";
import { AssociationSearchPort } from "./association-search.port";
import AssociationSearchMapper from "./association-search.mapper";
import AssociationSearchDbo, { AssociationSearchPartialUpdate } from "./@types/AssociationSearchDbo";

export class AssociationSearchAdapter extends MongoAdapter<AssociationSearchDbo> implements AssociationSearchPort {
    collectionName = "association-search";

    async createIndexes(): Promise<void> {
        await this.collection.createIndex(
            { siren: 1 },
            { unique: true, partialFilterExpression: { fieldName: { $exists: true } } },
        );
    }

    findByText(text: string): Promise<AssociationSearchEntity[]> {
        console.log("text: ", text);
        return this.collection
            .find({
                searchName: { $regex: text },
            })
            .map(doc => AssociationSearchMapper.toEntity(doc))
            .toArray();
    }

    /**
     * Find the latest name associate at the siren
     *
     * @param {Siren} siren
     * @returns the latest name associate at the siren
     */
    async findOneBySiren(siren: Siren): Promise<AssociationSearchEntity | null> {
        const cursor = this.collection.find({ siren: siren.value }).sort({ updateDate: 1 });

        if (!cursor.hasNext()) return null;
        const dbo = await cursor.next();
        await cursor.close();
        if (!dbo) return null;
        return AssociationSearchMapper.toEntity(dbo);
    }

    // becarefull as here we do not pass entities but partial dbos
    public async upsertMany(dbos: Partial<AssociationSearchPartialUpdate>[]): Promise<void> {
        const operations = dbos.map(dbo => ({
            updateOne: {
                filter: dbo.siren ? { siren: dbo.siren } : { rna: dbo.rna }, // most of the time we update from siren
                update: { $set: dbo },
                upsert: true,
            },
        }));

        await this.collection.bulkWrite(operations);
    }
}

const associationSearchAdapter = new AssociationSearchAdapter();

export default associationSearchAdapter;

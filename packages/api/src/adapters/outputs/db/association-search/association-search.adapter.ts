import { AnyBulkWriteOperation } from "mongodb";
import AssociationSearchEntity, { AssociationSearchPartialUpdate } from "../../../../entities/AssociationSearchEntity";
import MongoAdapter from "../MongoAdapter";
import Siren from "../../../../identifier-objects/Siren";
import { AssociationSearchPort } from "./association-search.port";

import AssociationSearchMapper from "./association-search.mapper";
import AssociationSearchDbo from "./@types/AssociationSearchDbo";

export class AssociationSearchAdapter extends MongoAdapter<AssociationSearchDbo> implements AssociationSearchPort {
    collectionName = "association-search";

    async createIndexes(): Promise<void> {
        await this.collection.createIndex(
            { searchKey: 1 },
            {
                unique: true,
                sparse: true,
            },
        );
        await this.collection.createIndex({ siren: 1 });
    }

    search(searchQuery: string): Promise<AssociationSearchEntity[]> {
        return this.collection
            .find({
                searchKey: { $regex: searchQuery },
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

    public async upsertMany(entities: AssociationSearchPartialUpdate[]): Promise<void> {
        const operations = entities.map(
            e =>
                ({
                    updateOne: {
                        filter: e.siren ? { siren: e.siren } : { rna: e.rna }, // most of the time we update from siren
                        update: { $set: AssociationSearchMapper.toPartialDbo(e) },
                        upsert: true,
                    },
                }) as AnyBulkWriteOperation<AssociationSearchDbo>,
        );
        await this.collection.bulkWrite(operations);
    }
}

const associationSearchAdapter = new AssociationSearchAdapter();

export default associationSearchAdapter;

import { AnyBulkWriteOperation } from "mongodb";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";
import MongoAdapter from "../MongoAdapter";
import Siren from "../../../identifierObjects/Siren";
import { UniteLegalNamePort } from "./unite-legale-name.port";

import UniteLegalNameMapper from "./unite-legale-name.mapper";
import UniteLegaleNameDbo from "./@types/UniteLegaleNameDbo";

export class UniteLegaleNameAdapter extends MongoAdapter<UniteLegaleNameDbo> implements UniteLegalNamePort {
    collectionName = "unite-legal-names";

    async createIndexes(): Promise<void> {
        await this.collection.createIndex({ searchKey: 1 }, { unique: true });
        await this.collection.createIndex({ siren: 1 });
    }

    search(searchQuery: string): Promise<UniteLegalNameEntity[]> {
        return this.collection
            .find({
                searchKey: { $regex: searchQuery },
            })
            .map(doc => UniteLegalNameMapper.toEntity(doc))
            .toArray();
    }

    /**
     * Find the latest name associate at the siren
     *
     * @param {Siren} siren
     * @returns the latest name associate at the siren
     */
    async findOneBySiren(siren: Siren): Promise<UniteLegalNameEntity | null> {
        const cursor = this.collection.find({ siren: siren.value }).sort({ updatedDate: 1 });

        if (!cursor.hasNext()) return null;
        const dbo = await cursor.next();
        await cursor.close();
        if (!dbo) return null;
        return UniteLegalNameMapper.toEntity(dbo);
    }

    async upsert(entity: UniteLegalNameEntity): Promise<void> {
        await this.collection.updateOne(
            { searchKey: entity.searchKey },
            { $set: UniteLegalNameMapper.toDbo(entity) },
            {
                upsert: true,
            },
        );
    }

    public async upsertMany(entities: UniteLegalNameEntity[]): Promise<void> {
        const operations = entities.map(
            e =>
                ({
                    updateOne: {
                        filter: { searchKey: e.searchKey },
                        update: { $set: UniteLegalNameMapper.toDbo(e) },
                        upsert: true,
                    },
                }) as AnyBulkWriteOperation<UniteLegaleNameDbo>,
        );
        await this.collection.bulkWrite(operations);
    }
}

const uniteLegalNameAdapter = new UniteLegaleNameAdapter();

export default uniteLegalNameAdapter;

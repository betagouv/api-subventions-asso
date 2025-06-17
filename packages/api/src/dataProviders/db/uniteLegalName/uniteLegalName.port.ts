import { AnyBulkWriteOperation } from "mongodb";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";
import MongoPort from "../../../shared/MongoPort";
import Siren from "../../../identifierObjects/Siren";
import UniteLegalNameAdapter from "./UniteLegalName.adapter";
import UniteLegalNameDbo from "./UniteLegalNameDbo";

export class UniteLegalNamePort extends MongoPort<UniteLegalNameDbo> {
    collectionName = "unite-legal-names";

    async createIndexes() {
        await this.collection.createIndex({ searchKey: 1 }, { unique: true });
        await this.collection.createIndex({ siren: 1 });
    }

    search(searchQuery: string) {
        return this.collection
            .find({
                searchKey: { $regex: searchQuery },
            })
            .map(doc => UniteLegalNameAdapter.toEntity(doc))
            .toArray();
    }

    /**
     * Find the latest name associate at the siren
     *
     * @param {Siren} siren
     * @returns the latest name associate at the siren
     */
    async findOneBySiren(siren: Siren) {
        const cursor = this.collection.find({ siren: siren.value }).sort({ updatedDate: 1 });

        if (!cursor.hasNext()) return null;
        const dbo = await cursor.next();
        await cursor.close();
        if (!dbo) return null;
        return UniteLegalNameAdapter.toEntity(dbo);
    }

    upsert(entity: UniteLegalNameEntity) {
        return this.collection.updateOne(
            { searchKey: entity.searchKey },
            { $set: UniteLegalNameAdapter.toDbo(entity) },
            {
                upsert: true,
            },
        );
    }

    public upsertMany(entities: UniteLegalNameEntity[]) {
        const operations = entities.map(
            e =>
                ({
                    updateOne: {
                        filter: { searchKey: e.searchKey },
                        update: { $set: UniteLegalNameAdapter.toDbo(e) },
                        upsert: true,
                    },
                }) as AnyBulkWriteOperation<UniteLegalNameDbo>,
        );
        return this.collection.bulkWrite(operations);
    }
}

const uniteLegalNamePort = new UniteLegalNamePort();

export default uniteLegalNamePort;

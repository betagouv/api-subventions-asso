import { FindOneAndUpdateOptions } from "mongodb";
import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import OsirisActionEntityDbo from "../../../../modules/providers/osiris/entities/OsirisActionEntityDbo";
import MongoCnxError from "../../../../shared/errors/MongoCnxError";
import MongoPort from "../../../../shared/MongoPort";
import Siren from "../../../../valueObjects/Siren";
import OsirisActionAdapter from "./osirisAction.adapter";

export class OsirisActionPort extends MongoPort<OsirisActionEntityDbo> {
    collectionName = "osiris-actions";

    async createIndexes() {
        await this.collection.createIndex({ "indexedInformations.uniqueId": 1 }, { unique: true });
        await this.collection.createIndex({ "indexedInformations.osirisActionId": 1 });
        await this.collection.createIndex({ "indexedInformations.compteAssoId": 1 });
        await this.collection.createIndex({ "indexedInformations.siret": 1 });
    }

    // Action Part
    public async add(osirisAction: OsirisActionEntity) {
        await this.collection.insertOne(OsirisActionAdapter.toDbo(osirisAction));
        return osirisAction;
    }

    public async update(osirisAction: OsirisActionEntity) {
        const options: FindOneAndUpdateOptions = { returnDocument: "after", includeResultMetadata: true };
        const { _id, ...actionWithoutId } = OsirisActionAdapter.toDbo(osirisAction);
        const updateRes = await this.collection.findOneAndUpdate(
            { "indexedInformations.uniqueId": osirisAction.indexedInformations.uniqueId },
            { $set: actionWithoutId },
            options,
        );

        //@ts-expect-error -- mongo typing expects no metadata
        const dbo = updateRes?.value;
        if (!dbo) throw new MongoCnxError();
        return OsirisActionAdapter.toEntity(dbo);
    }

    public async findByUniqueId(uniqueId: string) {
        const dbo = await this.collection.findOne({
            "indexedInformations.uniqueId": uniqueId,
        });
        if (!dbo) return null;
        return OsirisActionAdapter.toEntity(dbo);
    }

    public cursorFind(query = {}) {
        return this.collection.find(query);
    }

    public async findByRequestUniqueId(requestUniqueId: string) {
        const dbos = await this.collection.find({ "indexedInformations.requestUniqueId": requestUniqueId }).toArray();
        return dbos.map(dbo => OsirisActionAdapter.toEntity(dbo));
    }

    public async findBySiren(siren: Siren) {
        const dbos = await this.collection
            .find({ "indexedInformations.siret": new RegExp(`^${siren.value}\\d{5}`) })
            .toArray();
        return dbos.map(dbo => OsirisActionAdapter.toEntity(dbo));
    }
}

const osirisActionPort: OsirisActionPort = new OsirisActionPort();

export default osirisActionPort;

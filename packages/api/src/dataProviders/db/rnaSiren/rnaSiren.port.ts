import Siren from "../../../valueObjects/Siren";
import Rna from "../../../valueObjects/Rna";
import { isMongoDuplicateError } from "../../../shared/helpers/MongoHelper";
import RnaSirenEntity from "../../../entities/RnaSirenEntity";
import MongoPort from "../../../shared/MongoPort";
import RnaSirenAdapter from "./RnaSiren.adapter";
import RnaSirenDbo from "./RnaSirenDbo";

export class RnaSirenPort extends MongoPort<RnaSirenDbo> {
    collectionName = "rna-siren";

    async createIndexes() {
        await this.collection.createIndex({ rna: 1 });
        await this.collection.createIndex({ siren: 1 });
        await this.collection.createIndex({ rna: 1, siren: 1 }, { unique: true });
    }

    async insert(entity: RnaSirenEntity) {
        try {
            await this.collection.insertOne(RnaSirenAdapter.toDbo(entity));
        } catch (e: unknown) {
            if (isMongoDuplicateError(e)) {
                // One or many entities already exist in database but other entities have been saved
                return; // we can safely ignore it
            }
            throw e;
        }
    }

    async find(id: Rna | Siren) {
        let dbos: RnaSirenDbo[] = [];
        if (id instanceof Rna) {
            dbos = await this.collection
                .find({
                    rna: id.value,
                })
                .toArray();
        } else if (id instanceof Siren) {
            dbos = await this.collection
                .find({
                    siren: id.value,
                })
                .toArray();
        } else {
            throw new Error("Identifier not supported");
        }

        if (!dbos.length) return null;

        return dbos.map(dbo => RnaSirenAdapter.toEntity(dbo));
    }
}

const rnaSirenPort = new RnaSirenPort();

export default rnaSirenPort;

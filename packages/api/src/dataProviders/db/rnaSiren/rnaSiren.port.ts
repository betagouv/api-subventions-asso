import { Rna, Siren } from "dto";
import { isMongoDuplicateError } from "../../../shared/helpers/MongoHelper";
import RnaSirenEntity from "../../../entities/RnaSirenEntity";
import MongoRepository from "../../../shared/MongoRepository";
import { isRna } from "../../../shared/Validators";
import RnaSirenAdapter from "./RnaSiren.adapter";
import RnaSirenDbo from "./RnaSirenDbo";

export class RnaSirenPort extends MongoRepository<RnaSirenDbo> {
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

    async find(query: Rna | Siren) {
        let dbos: RnaSirenDbo[] = [];
        if (isRna(query)) {
            dbos = await this.collection
                .find({
                    rna: query,
                })
                .toArray();
        } else {
            dbos = await this.collection
                .find({
                    siren: query,
                })
                .toArray();
        }

        if (!dbos.length) return null;

        return dbos.map(dbo => RnaSirenAdapter.toEntity(dbo));
    }
}

const rnaSirenPort = new RnaSirenPort();

export default rnaSirenPort;

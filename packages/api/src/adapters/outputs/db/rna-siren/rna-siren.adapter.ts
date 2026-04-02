import Siren from "../../../../identifierObjects/Siren";
import Rna from "../../../../identifierObjects/Rna";
import { isMongoDuplicateError } from "../../../../shared/helpers/MongoHelper";
import RnaSirenEntity from "../../../../entities//RnaSirenEntity";
import MongoAdapter from "../MongoAdapter";
import RnaSirenMapper from "./rna-siren.mapper";
import { RnaSirenPort } from "./rna-siren.port";
import RnaSirenDbo from "./@types/RnaSirenDbo";

export class RnaSirenAdapter extends MongoAdapter<RnaSirenDbo> implements RnaSirenPort {
    collectionName = "rna-siren";

    async createIndexes() {
        await this.collection.createIndex({ rna: 1 });
        await this.collection.createIndex({ siren: 1 });
        await this.collection.createIndex({ rna: 1, siren: 1 }, { unique: true });
    }

    async insertMany(entities: RnaSirenEntity[]): Promise<void> {
        if (!entities.length) return;
        try {
            await this.collection.insertMany(
                entities.map(e => RnaSirenMapper.toDbo(e)),
                { ordered: false },
            );
        } catch (e: unknown) {
            if (isMongoDuplicateError(e)) {
                // One or many entities already exist in database but other entities have been saved
                return; // we can safely ignore it
            }
            throw e;
        }
    }

    async insert(entity: RnaSirenEntity): Promise<void> {
        try {
            await this.collection.insertOne(RnaSirenMapper.toDbo(entity));
        } catch (e: unknown) {
            if (isMongoDuplicateError(e)) {
                // One or many entities already exist in database but other entities have been saved
                return; // we can safely ignore it
            }
            throw e;
        }
    }

    async find(id: Rna | Siren): Promise<RnaSirenEntity[] | null> {
        let dbos: RnaSirenDbo[] = [];
        let rnaSirenToFind;

        if (id instanceof Rna) rnaSirenToFind = { rna: id.value };
        else if (id instanceof Siren) rnaSirenToFind = { siren: id.value };
        else throw new Error("Identifier not supported");

        dbos = await this.collection.find(rnaSirenToFind).toArray();

        if (!dbos.length) return null;

        return dbos.map(dbo => RnaSirenMapper.toEntity(dbo));
    }
}

const rnaSirenAdapter = new RnaSirenAdapter();

export default rnaSirenAdapter;

import { FindOneAndUpdateOptions } from "mongodb";
import { MongoCnxError } from "../../../../../shared/errors/MongoCnxError";
import OsirisActionEntity from "../../../../../modules/providers/osiris/entities/OsirisActionEntity";
import MongoAdapter from "../../MongoAdapter";
import Siren from "../../../../../identifierObjects/Siren";
import OsirisActionMapper from "./osiris-action.mapper";
import { OsirisActionPort } from "./osiris-action.port";
import { BulkUpsertResult } from "../../@types/bulk-upsert-result";

export class OsirisActionAdapter extends MongoAdapter<OsirisActionEntity> implements OsirisActionPort {
    collectionName = "osiris-actions";

    async createIndexes() {
        await this.collection.createIndex({ "indexedInformations.uniqueId": 1 }, { unique: true });
        await this.collection.createIndex({ "indexedInformations.osirisActionId": 1 });
        await this.collection.createIndex({ "indexedInformations.requestUniqueId": 1 });
        await this.collection.createIndex({ "indexedInformations.compteAssoId": 1 });
        await this.collection.createIndex({ "indexedInformations.siret": 1 });
    }

    joinIndexes = {
        osirisRequestPort: "indexedInformations.requestUniqueId",
    };

    // Action Part
    public async add(osirisAction: OsirisActionEntity): Promise<OsirisActionEntity> {
        await this.collection.insertOne(osirisAction);
        return osirisAction;
    }

    /*
     * @deprecated
     * */
    public async update(osirisAction: OsirisActionEntity): Promise<OsirisActionEntity> {
        const options: FindOneAndUpdateOptions = { returnDocument: "after", includeResultMetadata: true };
        const updateRes = await this.collection.findOneAndUpdate(
            { "indexedInformations.uniqueId": osirisAction.indexedInformations.uniqueId },
            { $set: osirisAction },
            options,
        );

        //@ts-expect-error -- mongo typing expects no metadata
        const dbo = updateRes?.value;
        if (!dbo) throw new MongoCnxError();
        return dbo;
    }

    public upsertOne(osirisAction: OsirisActionEntity) {
        const options = { upsert: true } as FindOneAndUpdateOptions;
        return this.collection.updateOne(
            { "indexedInformations.uniqueId": osirisAction.indexedInformations.uniqueId },
            { $set: osirisAction },
            options,
        );
    }

    public async bulkUpsert(osirisActions: OsirisActionEntity[]): Promise<BulkUpsertResult> {
        const bulk = osirisActions.map(action => {
            return {
                updateOne: {
                    filter: { "indexedInformations.uniqueId": action.indexedInformations.uniqueId },
                    update: { $set: action },
                    upsert: true,
                },
            };
        });

        if (!bulk.length) {
            return {
                insertedCount: 0,
                upsertedCount: 0,
                modifiedCount: 0,
                matchedCount: 0,
            };
        }

        const result = await this.collection.bulkWrite(bulk, { ordered: false });

        return {
            insertedCount: result.insertedCount,
            upsertedCount: result.upsertedCount,
            modifiedCount: result.modifiedCount,
            matchedCount: result.matchedCount,
        };
    }

    public cursorFind(query = {}) {
        return this.collection.find(query).map(dbo => OsirisActionMapper.toEntity(dbo));
    }

    public async getAll() {
        return this.cursorFind().toArray();
    }

    public async getAllByExercise(exercise: number) {
        return this.cursorFind({ indexedInformations: { exercise } }).toArray();
    }

    public async findByRequestUniqueId(requestUniqueId: string): Promise<OsirisActionEntity[]> {
        const dbos = await this.collection.find({ "indexedInformations.requestUniqueId": requestUniqueId }).toArray();
        return dbos.map(dbo => OsirisActionMapper.toEntity(dbo));
    }

    public async findBySiren(siren: Siren): Promise<OsirisActionEntity[]> {
        const dbos = await this.collection
            .find({ "indexedInformations.siret": new RegExp(`^${siren.value}\\d{5}`) })
            .toArray();
        return dbos.map(dbo => OsirisActionMapper.toEntity(dbo));
    }
}

const osirisActionAdapter: OsirisActionAdapter = new OsirisActionAdapter();

export default osirisActionAdapter;

import { FindOneAndUpdateOptions } from "mongodb";
import { MongoCnxError } from "../../../../../shared/errors/MongoCnxError";
import OsirisActionEntity from "../../../../../modules/providers/osiris/entities/OsirisActionEntity";
import MongoAdapter from "../../MongoAdapter";
import Siren from "../../../../../identifier-objects/Siren";
import { OsirisActionPort } from "./osiris-action.port";
import { BulkUpsertResult } from "../../@types/bulk-upsert-result";

export class OsirisActionAdapter extends MongoAdapter<OsirisActionEntity> implements OsirisActionPort {
    collectionName = "osiris-actions";

    async createIndexes() {
        await this.collection.createIndex({ "dossier.uniqueId": 1 }, { unique: true });
        await this.collection.createIndex({ "dossier.osirisActionId": 1 });
        await this.collection.createIndex({ "dossier.requestUniqueId": 1 });
        await this.collection.createIndex({ "dossier.compteAssoId": 1 });
        await this.collection.createIndex({ "beneficiaire.siret": 1 });
    }

    joinIndexes = {
        osirisRequestPort: "dossier.requestUniqueId",
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
            { "dossier.uniqueId": osirisAction.dossier.uniqueId },
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
            { "dossier.uniqueId": osirisAction.dossier.uniqueId },
            { $set: osirisAction },
            options,
        );
    }

    public async bulkUpsert(osirisActions: OsirisActionEntity[]): Promise<BulkUpsertResult> {
        const bulk = osirisActions.map(action => {
            return {
                updateOne: {
                    filter: { "dossier.uniqueId": action.dossier.uniqueId },
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
        return this.collection.find(query, { projection: { _id: 0 } });
    }

    public async getAll() {
        return this.cursorFind().toArray();
    }

    public async getAllByExercise(exercise: number) {
        return this.cursorFind({ "dossier.exerciceBudgetaire": exercise }).toArray();
    }

    public async findByRequestUniqueId(requestUniqueId: string): Promise<OsirisActionEntity[]> {
        return this.collection
            .find({ "dossier.requestUniqueId": requestUniqueId }, { projection: { _id: 0 } })
            .toArray();
    }

    public async findBySiren(siren: Siren): Promise<OsirisActionEntity[]> {
        return this.collection
            .find({ "beneficiaire.siret": new RegExp(`^${siren.value}\\d{5}`) }, { projection: { _id: 0 } })
            .toArray();
    }

    public async findByOsirisId(osirisId: string): Promise<OsirisActionEntity[]> {
        return this.collection
            .find({ "dossier.requestUniqueId": new RegExp(`^${osirisId}-\\d+$`) }, { projection: { _id: 0 } }) // regex to match the osirisId with the year
            .toArray();
    }

    public async findByOsirisIds(osirisIds: string[]): Promise<OsirisActionEntity[]> {
        return this.collection
            .find(
                { "dossier.requestUniqueId": { $in: osirisIds.map(id => new RegExp(`^${id}-\\d+$`)) } },
                { projection: { _id: 0 } },
            ) // regex to match the osirisIds with the year
            .toArray();
    }
}

const osirisActionAdapter: OsirisActionAdapter = new OsirisActionAdapter();

export default osirisActionAdapter;

import { AnyBulkWriteOperation } from "mongodb";
import Siret from "../../../../../identifier-objects/Siret";
import Siren from "../../../../../identifier-objects/Siren";
import { DefaultObject } from "../../../../../@types";
import MongoAdapter from "../../MongoAdapter";
import ChorusEntity from "../../../../../modules/providers/chorus/entities/ChorusEntity";
import { ChorusPort } from "./chorus.port";

export class ChorusAdapter extends MongoAdapter<ChorusEntity> implements ChorusPort {
    readonly collectionName = "chorus";

    public async findOneByEJ(ej: string) {
        return this.collection.findOne({ ej: ej }, { projection: { _id: 0 } });
    }

    public async findOneBySiret(siret: Siret) {
        return this.collection.findOne({ siret: siret.value });
    }

    public async findOneBySiren(siren: Siren) {
        return this.collection.findOne({
            siret: new RegExp(`^${siren.value}\\d{5}`),
        });
    }

    public async findOneByUniqueId(uniqueId: string) {
        return this.collection.findOne({ uniqueId: uniqueId }, { projection: { _id: 0 } });
    }

    public async create(entity: ChorusEntity) {
        await this.collection.insertOne(entity);
    }

    public async upsertMany(entities: ChorusEntity[]) {
        const operations = entities.map(
            e =>
                ({
                    updateOne: {
                        filter: { uniqueId: e.uniqueId },
                        update: { $set: e },
                        upsert: true,
                    },
                }) as AnyBulkWriteOperation<ChorusEntity>,
        );
        await this.collection.bulkWrite(operations);
        return;
    }

    public async update(entity: ChorusEntity) {
        await this.collection.updateOne({ uniqueId: entity.uniqueId }, { $set: entity });
        await this.collection.findOne({ uniqueId: entity.uniqueId }, { projection: { _id: 0 } });
        return;
    }

    public async findBySiret(siret: Siret) {
        return this.collection.find({ siret: siret.value }, { projection: { _id: 0 } }).toArray();
    }

    public async findByEJ(ej: string) {
        return this.collection.find({ ej: ej }, { projection: { _id: 0 } }).toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection
            .find(
                {
                    siret: new RegExp(`^${siren.value}\\d{5}`),
                },
                { projection: { _id: 0 } },
            )
            .toArray();
    }

    public cursorFind(query: DefaultObject<unknown> = {}, projection: DefaultObject<unknown> = {}) {
        return this.collection.find(query, projection);
    }

    public cursorFindOnExercise(exerciceBudgetaire: number) {
        return this.cursorFind({
            exercice: exerciceBudgetaire,
        });
    }

    async createIndexes() {
        await this.collection.createIndex({ uniqueId: 1 }, { unique: true });
        await this.collection.createIndex({ ej: 1 });
        await this.collection.createIndex({ siret: 1 });
        await this.collection.createIndex({ updated: 1 });
    }
}

const chorusAdapter = new ChorusAdapter();

export default chorusAdapter;

import { AnyBulkWriteOperation } from "mongodb";
import Siret from "../../../../../identifier-objects/Siret";
import Siren from "../../../../../identifier-objects/Siren";
import { DefaultObject } from "../../../../../@types";
import MongoAdapter from "../../MongoAdapter";
import ChorusEntity, { ChorusDbo } from "../../../../../modules/providers/chorus/entities/ChorusEntity";
import { ChorusPort } from "./chorus.port";

export class ChorusAdapter extends MongoAdapter<ChorusDbo> implements ChorusPort {
    readonly collectionName = "chorus";

    private toMongoEntity(entity: ChorusEntity): ChorusDbo {
        const { siret, ...mongoEntity } = entity;
        return siret ? { ...mongoEntity, siret: siret.value } : mongoEntity;
    }

    private toEntity(dbo: ChorusDbo): ChorusEntity {
        const { siret, ...entity } = dbo;
        return siret ? { ...entity, siret: new Siret(siret) } : entity;
    }

    public async findOneByEJ(ej: string) {
        const dbo = await this.collection.findOne({ ej: ej }, { projection: { _id: 0 } });
        return dbo && this.toEntity(dbo);
    }

    public async findOneBySiret(siret: Siret) {
        const dbo = await this.collection.findOne({ siret: siret.value });
        return dbo && this.toEntity(dbo);
    }

    public async findOneBySiren(siren: Siren) {
        const dbo = await this.collection.findOne({
            siret: new RegExp(`^${siren.value}\\d{5}`),
        });
        return dbo && this.toEntity(dbo);
    }

    public async findOneByUniqueId(uniqueId: string) {
        const dbo = await this.collection.findOne({ uniqueId: uniqueId }, { projection: { _id: 0 } });
        return dbo && this.toEntity(dbo);
    }

    public async create(entity: ChorusEntity) {
        await this.collection.insertOne(this.toMongoEntity(entity));
    }

    public async upsertMany(entities: ChorusEntity[]) {
        const operations = entities.map(
            e =>
                ({
                    updateOne: {
                        filter: { uniqueId: e.uniqueId },
                        update: { $set: this.toMongoEntity(e) },
                        upsert: true,
                    },
                }) as AnyBulkWriteOperation<ChorusDbo>,
        );
        await this.collection.bulkWrite(operations);
        return;
    }

    public async update(entity: ChorusEntity) {
        await this.collection.updateOne({ uniqueId: entity.uniqueId }, { $set: this.toMongoEntity(entity) });
        await this.collection.findOne({ uniqueId: entity.uniqueId }, { projection: { _id: 0 } });
        return;
    }

    public async findBySiret(siret: Siret) {
        return this.collection
            .find({ siret: siret.value }, { projection: { _id: 0 } })
            .map(dbo => this.toEntity(dbo))
            .toArray();
    }

    public async findByEJ(ej: string) {
        return this.collection
            .find({ ej: ej }, { projection: { _id: 0 } })
            .map(dbo => this.toEntity(dbo))
            .toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection
            .find({ siret: new RegExp(`^${siren.value}\\d{5}`) }, { projection: { _id: 0 } })
            .map(dbo => this.toEntity(dbo))
            .toArray();
    }

    public cursorFind(query: DefaultObject<unknown> = {}, projection: DefaultObject<unknown> = {}) {
        return this.collection.find(query, { projection }).map(dbo => this.toEntity(dbo));
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

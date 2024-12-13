import { AnyBulkWriteOperation, ObjectId, WithId } from "mongodb";
import Siret from "../../../../valueObjects/Siret";
import Siren from "../../../../valueObjects/Siren";
import { DefaultObject } from "../../../../@types";
import MongoPort from "../../../../shared/MongoPort";
import ChorusLineEntity from "../../../../modules/providers/chorus/entities/ChorusLineEntity";

export class ChorusLinePort extends MongoPort<ChorusLineEntity> {
    readonly collectionName = "chorus-line";

    public async findOneByEJ(ej: string) {
        return this.collection.findOne({ "indexedInformations.ej": ej });
    }

    public async findOneBySiret(siret: Siret) {
        return this.collection.findOne({ "indexedInformations.siret": siret.value });
    }

    public async findOneBySiren(siren: Siren) {
        return this.collection.findOne({
            "indexedInformations.siret": new RegExp(`^${siren.value}\\d{5}`),
        });
    }

    public async findOneByUniqueId(uniqueId: string) {
        return this.collection.findOne({ uniqueId: uniqueId });
    }

    public async create(entity: ChorusLineEntity) {
        await this.collection.insertOne(entity);
    }

    public async upsertMany(entities: ChorusLineEntity[]) {
        const operations = entities.map(
            e =>
                ({
                    updateOne: {
                        filter: { uniqueId: e.uniqueId },
                        update: { $set: e },
                        upsert: true,
                    },
                } as AnyBulkWriteOperation<ChorusLineEntity>),
        );
        return this.collection.bulkWrite(operations);
    }

    public async update(entity: ChorusLineEntity) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...entityWithoutId } = entity;

        await this.collection.updateOne({ uniqueId: entity.uniqueId }, { $set: entityWithoutId });

        return this.collection.findOne({ uniqueId: entity.uniqueId }) as Promise<WithId<ChorusLineEntity>>;
    }

    public async updateById(id: ObjectId, entity: ChorusLineEntity) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...entityWithoutId } = entity;

        await this.collection.updateOne({ _id: id }, { $set: entityWithoutId });

        return this.collection.findOne({ _id: id }) as Promise<WithId<ChorusLineEntity>>;
    }

    public async findBySiret(siret: Siret) {
        return this.collection.find({ "indexedInformations.siret": siret.value }).toArray();
    }

    public async findByEJ(ej: string) {
        return this.collection.find({ "indexedInformations.ej": ej }).toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection
            .find({
                "indexedInformations.siret": new RegExp(`^${siren.value}\\d{5}`),
            })
            .toArray();
    }

    public cursorFind(query: DefaultObject<unknown> = {}, projection: DefaultObject<unknown> = {}) {
        return this.collection.find(query, projection);
    }

    public cursorFindDataWithoutHash(exerciceBudgetaire?: number) {
        // In chorus database # are used instead of non siret identifier, we exclude here these data
        if (!exerciceBudgetaire) {
            return this.cursorFind({ "indexedInformations.siret": { $ne: "#" } });
        } else
            return this.cursorFind({
                "indexedInformations.exercice": exerciceBudgetaire,
                "indexedInformations.siret": { $ne: "#" },
            });
    }

    async createIndexes() {
        await this.collection.createIndex({ uniqueId: 1 }, { unique: true });
        await this.collection.createIndex({ "indexedInformations.ej": 1 });
        await this.collection.createIndex({ "indexedInformations.siret": 1 });
        await this.collection.createIndex({ updated: 1 });
    }
}

const chorusLinePort = new ChorusLinePort();

export default chorusLinePort;
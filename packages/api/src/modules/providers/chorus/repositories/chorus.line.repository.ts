import { Siren, Siret } from "dto";
import { AnyBulkWriteOperation, ObjectId, WithId } from "mongodb";
import { DefaultObject } from "../../../../@types";
import MongoRepository from "../../../../shared/MongoRepository";
import ChorusLineEntity from "../entities/ChorusLineEntity";

export class ChorusLineRepository extends MongoRepository<ChorusLineEntity> {
    readonly collectionName = "chorus-line";

    public async findOneByEJ(ej: string) {
        return this.collection.findOne({ "indexedInformations.ej": ej });
    }

    public async findOneBySiret(siret: Siret) {
        return this.collection.findOne({ "indexedInformations.siret": siret });
    }

    public async findOneBySiren(siren: Siren) {
        return this.collection.findOne({
            "indexedInformations.siret": new RegExp(`^${siren}\\d{5}`),
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

    public async insertMany(entities: ChorusLineEntity[]) {
        return this.collection.insertMany(entities);
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
        return this.collection.find({ "indexedInformations.siret": siret }).toArray();
    }

    public async findByEJ(ej: string) {
        return this.collection.find({ "indexedInformations.ej": ej }).toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection
            .find({
                "indexedInformations.siret": new RegExp(`^${siren}\\d{5}`),
            })
            .toArray();
    }

    public cursorFind(query: DefaultObject<unknown> = {}, projection: DefaultObject<unknown> = {}) {
        return this.collection.find(query, projection);
    }

    public cursorFindIndexedData(objectIdThreshold?: ObjectId) {
        /*objectIDThreshold is used to get all the objects that have been
         created after the objectIDThreshold. It supposes that the ObjectID 
         are not manually defined
        */
        if (!objectIdThreshold) {
            return this.cursorFind({}, { indexedInformations: 1 });
        } else return this.cursorFind({ _id: { $gt: objectIdThreshold } }, { indexedInformations: 1 });
    }

    async createIndexes() {
        await this.collection.createIndex({ uniqueId: 1 }, { unique: true });
        await this.collection.createIndex({ "indexedInformations.ej": 1 });
        await this.collection.createIndex({ "indexedInformations.siret": 1 });
    }
}

const chorusLineRepository = new ChorusLineRepository();

export default chorusLineRepository;

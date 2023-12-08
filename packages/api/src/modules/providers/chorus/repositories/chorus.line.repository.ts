import { Siren, Siret } from "dto";
import { MongoServerError, ObjectId, WithId } from "mongodb";
import { DefaultObject } from "../../../../@types";
import MongoRepository from "../../../../shared/MongoRepository";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import { buildDuplicateIndexError, isDuplicateError } from "../../../../shared/helpers/MongoHelper";

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

    public async insertMany(entities: ChorusLineEntity[]) {
        return this.collection.insertMany(entities, { ordered: false }).catch(error => {
            if (error instanceof MongoServerError && isDuplicateError(error)) {
                throw buildDuplicateIndexError(error);
            }
        });
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

    private removeDuplicates(arr) {
        // TODO: remove this after investiguation and fix of chorus line duplicates
        const groupByUniqueId: WithId<ChorusLineEntity>[] = Object.values(
            arr.reduce((acc, vers) => {
                if (!acc[vers.uniqueId]) acc[vers.uniqueId] = [];
                acc[vers.uniqueId].push(vers);
                return acc;
            }, {}),
        );

        // TODO: remove this after investiguation and fix of chorus line duplicates
        const noDuplicates = groupByUniqueId.map(group => group[0]);
        return noDuplicates;
    }

    public async findBySiret(siret: Siret) {
        const result = await this.collection.find({ "indexedInformations.siret": siret }).toArray();
        return this.removeDuplicates(result);
    }

    public async findByEJ(ej: string) {
        const result = await this.collection.find({ "indexedInformations.ej": ej }).toArray();
        return this.removeDuplicates(result);
    }

    public async findBySiren(siren: Siren) {
        const result = await this.collection
            .find({
                "indexedInformations.siret": new RegExp(`^${siren}\\d{5}`),
            })
            .toArray();

        return this.removeDuplicates(result);
    }

    public cursorFind(query: DefaultObject<unknown> = {}) {
        return this.collection.find(query);
    }

    async createIndexes() {
        await this.collection.createIndex({ uniqueId: 1 }, { unique: true });
        await this.collection.createIndex({ "indexedInformations.ej": 1 });
        await this.collection.createIndex({ "indexedInformations.siret": 1 });
    }
}

const chorusLineRepository = new ChorusLineRepository();

export default chorusLineRepository;

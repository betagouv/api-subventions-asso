import { Siren, Siret } from "dto";
import { ObjectId, WithId } from "mongodb";
import { DefaultObject } from "../../../../@types";
import MigrationRepository from "../../../../shared/MigrationRepository";
import ChorusLineEntity from "../entities/ChorusLineEntity";

export class ChorusLineRepository extends MigrationRepository<ChorusLineEntity> {
    readonly collectionName = "chorus-line";
    readonly collectionImportName = "chorus-line-IMPORT";

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

    public async insertMany(entities: ChorusLineEntity[], dropDB = false) {
        if (dropDB) {
            return this.db
                .collection<ChorusLineEntity>(this.collectionImportName)
                .insertMany(entities, { ordered: false });
        }

        return this.collection.insertMany(entities, { ordered: false });
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

    public findBySiret(siret: Siret) {
        return this.collection.find({ "indexedInformations.siret": siret }).toArray();
    }

    public findByEJ(ej: string) {
        return this.collection.find({ "indexedInformations.ej": ej }).toArray();
    }

    public findBySiren(siren: Siren) {
        return this.collection
            .find({
                "indexedInformations.siret": new RegExp(`^${siren}\\d{5}`),
            })
            .toArray();
    }

    public cursorFind(query: DefaultObject<unknown> = {}) {
        return this.collection.find(query);
    }

    public async switchCollection() {
        const collectionExist = (await this.db.listCollections().toArray()).find(c => c.name === this.collectionName);

        if (collectionExist) await this.collection.rename(this.collectionName + "-OLD");

        await this.db.collection(this.collectionImportName).rename(this.collectionName);

        if (collectionExist) await this.db.collection(this.collectionName + "-OLD").drop();
    }

    async createIndexes() {
        await this.collection.createIndex({ uniqueId: 1 }, { unique: true });
        await this.collection.createIndex({ "indexedInformations.ej": 1 });
        await this.collection.createIndex({ "indexedInformations.siret": 1 });
    }
}

const chorusLineRepository = new ChorusLineRepository();

export default chorusLineRepository;

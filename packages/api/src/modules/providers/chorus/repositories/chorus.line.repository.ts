import { Siren, Siret } from "@api-subventions-asso/dto";
import { ObjectId, WithId } from "mongodb";
import { DefaultObject } from "../../../../@types";
import MigrationRepository from "../../../../shared/MigrationRepository";
import ChorusLineEntity from "../entities/ChorusLineEntity";

export class ChorusLineRepository extends MigrationRepository<ChorusLineEntity>{
    readonly collectionName = "chorus-line";

    public async findOneByEJ(ej: string) {
        return this.collection.findOne({ "indexedInformations.ej": ej });
    }

    public async findOneBySiret(siret: Siret) {
        return this.collection.findOne({ "indexedInformations.siret": siret });
    }

    public async findOneBySiren(siren: Siren) {
        return this.collection.findOne({ "indexedInformations.siret": new RegExp(`^${siren}\\d{5}`) });
    }

    public async findOneByUniqueId(uniqueId: string) {
        return this.collection.findOne({ "uniqueId": uniqueId });
    }

    public async create(entity: ChorusLineEntity) {
        const result = await this.collection.insertOne(entity);

        return this.collection.findOne({ _id: result.insertedId }) as Promise<WithId<ChorusLineEntity>>;
    }

    public async insertMany(entites: ChorusLineEntity[]) {
        await this.collection.insertMany(entites, {ordered: false});
    }

    public async update(entity: ChorusLineEntity) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...entityWithoutId } = entity;
        
        await this.collection.updateOne({ "uniqueId": entity.uniqueId }, {$set: entityWithoutId});
        
        return this.collection.findOne({ "uniqueId": entity.uniqueId }) as Promise<WithId<ChorusLineEntity>>;
    }

    public async updateById(id: ObjectId, entity: ChorusLineEntity) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...entityWithoutId } = entity;
        
        await this.collection.updateOne({ "_id": id }, {$set: entityWithoutId});

        return this.collection.findOne({ "_id": id }) as Promise<WithId<ChorusLineEntity>>;
    }

    public findBySiret(siret: Siret) {
        return this.collection.find({ "indexedInformations.siret": siret }).toArray();
    }

    public findByEJ(ej: string) {
        return this.collection.find({ "indexedInformations.ej": ej }).toArray();
    }

    public findBySiren(siren: Siren) {
        return this.collection.find({
            "indexedInformations.siret": new RegExp(`^${siren}\\d{5}`)
        }).toArray();
    }

    public cursorFind(query: DefaultObject<unknown> = {}) {
        return this.collection.find(query);
    }
}

const chorusLineRepository = new ChorusLineRepository();

export default chorusLineRepository;
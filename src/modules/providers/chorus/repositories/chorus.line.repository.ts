import { WithId } from "mongodb";
import { Siren } from "../../../../@types/Siren";
import { Siret } from "../../../../@types/Siret";
import MigrationRepository from "../../../../shared/MigrationRepository";
import ChorusLineEntity from "../entities/ChorusLineEntity";

export class ChorusLineRepository extends MigrationRepository<ChorusLineEntity>{
    readonly collectionName = "chorus-line";

    public async findOneByEJ(ej: string) {
        return this.collection.findOne({ "indexedInformations.ej": ej });
    }

    public async create(entity: ChorusLineEntity) {
        const result = await this.collection.insertOne(entity);

        return this.collection.findOne({ _id: result.insertedId }) as Promise<WithId<ChorusLineEntity>>;
    }

    public async update(entity: ChorusLineEntity) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...entityWithoutId } = entity;
        
        await this.collection.updateOne({ "indexedInformations.ej": entity.indexedInformations.ej }, {$set: entityWithoutId});
        
        return this.collection.findOne({ "indexedInformations.ej": entity.indexedInformations.ej }) as Promise<WithId<ChorusLineEntity>>;
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
}

const chorusLineRepository = new ChorusLineRepository();

export default chorusLineRepository;
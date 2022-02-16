import { WithId } from "mongodb";
import { Siret } from "../../../../@types/Siret";
import db from "../../../../shared/MongoConnection";
import ChorusLineEntity from "../entities/ChorusLineEntity";

export class ChorusLineRepository {
    private readonly collection = db.collection<ChorusLineEntity>("chorus-line");

    public async findByEJ(ej: string) {
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

    public findsBySiret(siret: Siret) {
        return this.collection.find({ "indexedInformations.siret": siret }).toArray();
    }
}

const chorusLineRepository = new ChorusLineRepository();

export default chorusLineRepository;
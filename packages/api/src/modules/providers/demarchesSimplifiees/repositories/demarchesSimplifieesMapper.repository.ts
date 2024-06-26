import MongoRepository from "../../../../shared/MongoRepository";
import DemarchesSimplifieesMapperEntity from "../entities/DemarchesSimplifieesMapperEntity";

export class DemarchesSimplifieesMapperRepository extends MongoRepository<DemarchesSimplifieesMapperEntity> {
    public collectionName = "demarches-simplifiees-schemas";

    async createIndexes() {
        await this.collection.createIndex({ demarcheId: 1 }, { unique: true });
    }

    async upsert(entity: DemarchesSimplifieesMapperEntity) {
        await this.collection.updateOne(
            {
                demarcheId: entity.demarcheId,
            },
            { $set: entity as Partial<DemarchesSimplifieesMapperEntity> },
            { upsert: true },
        );
    }

    findAll() {
        return this.collection.find({}, { projection: { _id: 0 } }).toArray();
    }

    getAcceptedDemarcheIds(): Promise<number[]> {
        return this.collection
            .find({})
            .map(schema => {
                return schema.demarcheId;
            })
            .toArray();
    }
}

const demarchesSimplifieesMapperRepository = new DemarchesSimplifieesMapperRepository();

export default demarchesSimplifieesMapperRepository;

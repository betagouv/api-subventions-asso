import MigrationRepository from "../../../../shared/MigrationRepository";
import DemarchesSimplifieesMapperEntity from "../entities/DemarchesSimplifieesMapperEntity";

export class DemarchesSimplifieesMapperRepository extends MigrationRepository<DemarchesSimplifieesMapperEntity> {
    public collectionName = "demarches-simplifiees-mapper";

    async createIndexes() {
        await this.collection.createIndex({ demarcheIdId: 1 }, { unique: true });
    }

    async upsert(entity: DemarchesSimplifieesMapperEntity) {
        await this.collection.updateOne(
            {
                demarcheId: entity.demarcheId
            },
            { $set: entity },
            { upsert: true }
        );
    }

    findAll() {
        return this.collection.find({}).toArray();
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

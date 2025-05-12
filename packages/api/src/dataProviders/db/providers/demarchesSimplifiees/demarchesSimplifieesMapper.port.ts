import MongoPort from "../../../../shared/MongoPort";
import DemarchesSimplifieesMapperEntity from "../../../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesMapperEntity";

export class DemarchesSimplifieesMapperPort extends MongoPort<DemarchesSimplifieesMapperEntity> {
    public collectionName = "demarches-simplifiees-schemas";

    async createIndexes() {
        await this.collection.createIndex({ demarcheId: 1 }, { unique: true });
    }

    async upsert(entity: DemarchesSimplifieesMapperEntity) {
        await this.collection.updateOne(
            { demarcheId: entity.demarcheId },
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
            .map(schema => schema.demarcheId)
            .toArray();
    }
}

const demarchesSimplifieesMapperPort = new DemarchesSimplifieesMapperPort();

export default demarchesSimplifieesMapperPort;

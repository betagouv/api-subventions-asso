import MongoPort from "../../../../shared/MongoPort";
import DemarchesSimplifieesSchemaEntity from "../../../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesSchemaEntity";

export class DemarchesSimplifieesSchemaPort extends MongoPort<DemarchesSimplifieesSchemaEntity> {
    public collectionName = "demarches-simplifiees-schemas";

    async createIndexes() {
        await this.collection.createIndex({ demarcheId: 1 }, { unique: true });
    }

    async upsert(entity: DemarchesSimplifieesSchemaEntity) {
        await this.collection.updateOne(
            {
                demarcheId: entity.demarcheId,
            },
            { $set: entity as Partial<DemarchesSimplifieesSchemaEntity> },
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

const demarchesSimplifieesSchemaPort = new DemarchesSimplifieesSchemaPort();

export default demarchesSimplifieesSchemaPort;

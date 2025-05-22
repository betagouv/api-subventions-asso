import MongoPort from "../../../../shared/MongoPort";
import DemarchesSimplifieesSchema from "../../../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesSchema";

export class DemarchesSimplifieesSchemaPort extends MongoPort<DemarchesSimplifieesSchema> {
    public collectionName = "demarches-simplifiees-schemas";

    async createIndexes() {
        await this.collection.createIndex({ demarcheId: 1 }, { unique: true });
    }

    async upsert(entity: DemarchesSimplifieesSchema) {
        await this.collection.updateOne(
            { demarcheId: entity.demarcheId },
            { $set: entity as Partial<DemarchesSimplifieesSchema> },
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

const demarchesSimplifieesSchemaPort = new DemarchesSimplifieesSchemaPort();

export default demarchesSimplifieesSchemaPort;

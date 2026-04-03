import MongoAdapter from "../../MongoAdapter";
import DemarchesSimplifieesSchema from "../../../../../modules/providers/demarches-simplifiees/entities/DemarchesSimplifieesSchema";
import { DemarchesSimplifieeSchemaPort } from "./demarches-simplifiee-schema.port";

export class DemarchesSimplifieesSchemaAdapter
    extends MongoAdapter<DemarchesSimplifieesSchema>
    implements DemarchesSimplifieeSchemaPort
{
    public collectionName = "demarches-simplifiees-schemas";

    async createIndexes() {
        await this.collection.createIndex({ demarcheId: 1 }, { unique: true });
    }

    async upsert(entity: DemarchesSimplifieesSchema): Promise<void> {
        await this.collection.updateOne(
            { demarcheId: entity.demarcheId },
            { $set: entity as Partial<DemarchesSimplifieesSchema> },
            { upsert: true },
        );
    }

    findAll(): Promise<DemarchesSimplifieesSchema[]> {
        return this.collection.find({}, { projection: { _id: 0 } }).toArray();
    }

    getAcceptedDemarcheIds(): Promise<number[]> {
        return this.collection
            .find({})
            .map(schema => schema.demarcheId)
            .toArray();
    }

    findById(demarcheId: number): Promise<DemarchesSimplifieesSchema | null> {
        return this.collection.findOne({ demarcheId }, { projection: { _id: 0 } });
    }
}

const demarchesSimplifieesSchemaAdapter = new DemarchesSimplifieesSchemaAdapter();

export default demarchesSimplifieesSchemaAdapter;

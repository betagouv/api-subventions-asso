import MongoPort from "../../../shared/MongoPort";
import GisproEntity from "../../../modules/providers/dauphin-gispro/@types/GisproEntity";
import { AnyBulkWriteOperation } from "mongodb";

export class GisproPort extends MongoPort<GisproEntity> {
    public collectionName = "gispro";

    public createIndexes(): void {
        this.collection.createIndex({ codeActionDossier: 1 });
        this.collection.createIndex({ codeProjet: 1 }, { unique: true });
    }

    async upsertMany(entities: GisproEntity[]) {
        const operations = entities.map(
            e =>
                ({
                    updateOne: {
                        filter: {
                            siret: e.siret,
                            exercise: e.exercise,
                            codeActionDossier: e.codeActionDossier,
                        },
                        update: { $set: e },
                        upsert: true,
                    },
                }) as AnyBulkWriteOperation<GisproEntity>,
        );
        return this.collection.bulkWrite(operations);
    }
}

const gisproPort = new GisproPort();
export default gisproPort;

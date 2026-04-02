import MongoAdapter from "../../MongoAdapter";
import Siren from "../../../../../identifier-objects/Siren";
import Siret from "../../../../../identifier-objects/Siret";
import DemarchesSimplifieesDataEntity from "../../../../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesDataEntity";
import { DemarchesSimplifieesDataProviderPort } from "./demarches-simplifiee-data.port";

export class DemarchesSimplifieesDataAdapter
    extends MongoAdapter<DemarchesSimplifieesDataEntity>
    implements DemarchesSimplifieesDataProviderPort
{
    collectionName = "demarches-simplifiees-data";

    async createIndexes() {
        await this.collection.createIndex({ "demande.id": 1 }, { unique: true });
        await this.collection.createIndex({ siret: 1 });
    }

    async upsert(entity: DemarchesSimplifieesDataEntity): Promise<void> {
        await this.collection.updateOne(
            {
                "demande.id": entity.demande.id,
            },
            { $set: entity as Partial<DemarchesSimplifieesDataEntity> },
            { upsert: true },
        );
    }

    findBySiret(siret: Siret): Promise<DemarchesSimplifieesDataEntity[]> {
        return this.collection.find({ siret: siret.value }).toArray();
    }

    findBySiren(siren: Siren): Promise<DemarchesSimplifieesDataEntity[]> {
        return this.collection
            .find({ siret: new RegExp(`^${siren.value}\\d{5}`) }, { projection: { _id: 0 } })
            .toArray();
    }

    async bulkUpsert(entities: DemarchesSimplifieesDataEntity[]): Promise<void> {
        const bulk = entities.map(entity => {
            return {
                updateOne: {
                    filter: { "demande.id": entity.demande.id },
                    update: { $set: entity },
                    upsert: true,
                },
            };
        });
        if (!bulk.length) return;
        await this.collection.bulkWrite(bulk, { ordered: false });
    }

    findAllCursor() {
        return this.collection.find({});
    }
}

const demarchesSimplifieesDataAdapter = new DemarchesSimplifieesDataAdapter();

export default demarchesSimplifieesDataAdapter;

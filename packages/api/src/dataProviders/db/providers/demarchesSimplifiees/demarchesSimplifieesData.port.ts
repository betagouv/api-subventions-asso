import MongoPort from "../../../../shared/MongoPort";
import Siren from "../../../../identifierObjects/Siren";
import Siret from "../../../../identifierObjects/Siret";
import DemarchesSimplifieesDataEntity from "../../../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesDataEntity";

export class DemarchesSimplifieesDataPort extends MongoPort<DemarchesSimplifieesDataEntity> {
    collectionName = "demarches-simplifiees-data";

    async createIndexes() {
        await this.collection.createIndex({ "demande.id": 1 }, { unique: true });
        await this.collection.createIndex({ siret: 1 });
    }

    async upsert(entity: DemarchesSimplifieesDataEntity) {
        await this.collection.updateOne(
            {
                "demande.id": entity.demande.id,
            },
            { $set: entity as Partial<DemarchesSimplifieesDataEntity> },
            { upsert: true },
        );
    }

    findBySiret(siret: Siret) {
        return this.collection.find({ siret: siret.value }).toArray();
    }

    findBySiren(siren: Siren) {
        return this.collection
            .find({ siret: new RegExp(`^${siren.value}\\d{5}`) }, { projection: { _id: 0 } })
            .toArray();
    }

    bulkUpsert(entities: DemarchesSimplifieesDataEntity[]) {
        const bulk = entities.map(entity => {
            return {
                updateOne: {
                    filter: { "demande.id": entity.demande.id },
                    update: { $set: entity },
                    upsert: true,
                },
            };
        });
        return bulk.length ? this.collection.bulkWrite(bulk, { ordered: false }) : Promise.resolve();
    }

    findAllCursor() {
        return this.collection.find({});
    }
}

const demarchesSimplifieesDataPort = new DemarchesSimplifieesDataPort();

export default demarchesSimplifieesDataPort;

import { Siren, Siret } from "dto";
import MongoRepository from "../../../../shared/MongoRepository";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";

export class DemarchesSimplifieesDataRepository extends MongoRepository<DemarchesSimplifieesDataEntity> {
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
        return this.collection.find({ siret }).toArray();
    }

    findBySiren(siren: Siren) {
        return this.collection.find({ siret: new RegExp(`^${siren}\\d{5}`) }, { projection: { _id: 0 } }).toArray();
    }
}

const demarchesSimplifieesDataRepository = new DemarchesSimplifieesDataRepository();

export default demarchesSimplifieesDataRepository;

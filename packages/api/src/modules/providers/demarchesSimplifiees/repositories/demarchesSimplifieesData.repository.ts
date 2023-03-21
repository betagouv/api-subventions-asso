import { Siren, Siret } from "@api-subventions-asso/dto";
import MigrationRepository from "../../../../shared/MigrationRepository";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";

export class DemarchesSimplifieesDataRepository extends MigrationRepository<DemarchesSimplifieesDataEntity> {
    collectionName = "demarches-simplifiees-data";

    async createIndexes() {
        await this.collection.createIndex({ "demande.id": 1 }, { unique: true });
        await this.collection.createIndex({ siret: 1 });
    }

    async upsert(entity: DemarchesSimplifieesDataEntity) {
        await this.collection.updateOne(
            {
                "demande.id": entity.demande.id
            },
            { $set: entity },
            { upsert: true }
        );
    }

    findBySiret(siret: Siret) {
        return this.collection.find({ siret }).toArray();
    }

    findBySiren(siren: Siren) {
        return this.collection.find({ siret: new RegExp(`^${siren}\\d{5}`) }).toArray();
    }
}

const demarchesSimplifieesDataRepository = new DemarchesSimplifieesDataRepository();

export default demarchesSimplifieesDataRepository;

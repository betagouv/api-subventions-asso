import { buildDuplicateIndexError, isMongoDuplicateError } from "../../../shared/helpers/MongoHelper";
import MongoPort from "../../../shared/MongoPort";
import { UniteLegalEntrepriseEntity } from "../../../entities/UniteLegalEntrepriseEntity";
import Siren from "../../../identifierObjects/Siren";
import { UniteLegalEntrepriseAdapter } from "./UniteLegalEntreprise.adapter";
import { UniteLegalEntrepriseDbo } from "./UniteLegalEntrepriseDbo";

export class UniteLegalEntreprisePort extends MongoPort<UniteLegalEntrepriseDbo> {
    collectionName = "unite-legal-entreprise";

    async createIndexes() {
        await this.collection.createIndex({ siren: 1 }, { unique: true });
    }

    async findOneBySiren(siren: Siren) {
        const dbo = await this.collection.findOne({ siren: siren.value });
        if (!dbo) return null;

        return UniteLegalEntrepriseAdapter.toEntity(dbo);
    }

    async insertMany(entities: UniteLegalEntrepriseEntity[]) {
        try {
            const dbos = entities.map(entity => UniteLegalEntrepriseAdapter.toDbo(entity));
            await this.collection.insertMany(dbos, { ordered: false });
        } catch (e: unknown) {
            if (isMongoDuplicateError(e)) {
                // One or many entities already exist in database but other entities have been saved
                throw buildDuplicateIndexError<UniteLegalEntrepriseDbo[]>(e);
            }
            throw e;
        }
    }
}

const uniteLegalEntreprisePort = new UniteLegalEntreprisePort();
export default uniteLegalEntreprisePort;

import { DuplicateIndexError } from "../../../shared/errors/dbError/DuplicateIndexError";
import uniteLegalEntrepriseAdapter from "../../../adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.adapter";
import { UniteLegaleEntrepriseEntity } from "../../../entities/UniteLegaleEntrepriseEntity";
import Siren from "../../../identifierObjects/Siren";

export class UniteLegalEntreprisesService {
    async insertManyEntrepriseSiren(entities: UniteLegaleEntrepriseEntity[]) {
        if (!entities.length) return;

        try {
            await uniteLegalEntrepriseAdapter.insertMany(entities);
        } catch (error: unknown) {
            if (error instanceof DuplicateIndexError) return; // One or many entities already exist in database but other entities have been saved

            throw error;
        }
    }

    async isEntreprise(siren: Siren) {
        return !!(await uniteLegalEntrepriseAdapter.findOneBySiren(siren));
    }
}

const uniteLegalEntreprisesService = new UniteLegalEntreprisesService();

export default uniteLegalEntreprisesService;

import { DuplicateIndexError } from "../../../shared/errors/dbError/DuplicateIndexError";
import uniteLegalEntreprisePort from "../../../dataProviders/db/uniteLegalEntreprise/uniteLegalEntreprise.port";
import { UniteLegalEntrepriseEntity } from "../../../entities/UniteLegalEntrepriseEntity";
import Siren from "../../../identifierObjects/Siren";

export class UniteLegalEntreprisesService {
    async insertManyEntrepriseSiren(entities: UniteLegalEntrepriseEntity[]) {
        if (!entities.length) return;

        try {
            await uniteLegalEntreprisePort.insertMany(entities);
        } catch (error: unknown) {
            if (error instanceof DuplicateIndexError) return; // One or many entities already exist in database but other entities have been saved

            throw error;
        }
    }

    async isEntreprise(siren: Siren) {
        //sirenIsEntreprise
        return !!(await uniteLegalEntreprisePort.findOneBySiren(siren));
    }
}

const uniteLegalEntreprisesService = new UniteLegalEntreprisesService();

export default uniteLegalEntreprisesService;

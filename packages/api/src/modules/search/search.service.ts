import etablissementService from "../etablissements/etablissements.service";
import associationsService from "../associations/associations.service";

import { Siret, DemandeSubvention } from "@api-subventions-asso/dto";
import subventionsService from "../subventions/subventions.service";
import versementsService from "../versements/versements.service";
import associationNameService from "../association-name/associationName.service"
export class SearchService {

    public async getBySiret(siret: Siret) {
        const etablissement = await etablissementService.getEtablissement(siret);
        if (!etablissement) return null;

        const association = await associationsService.getAssociationBySiret(siret)
        if (!association) return null;

        let demandes_subventions: DemandeSubvention[] = [];

        try {
            demandes_subventions = await subventionsService.getDemandesByEtablissement(siret);
        } catch (e) {
            if (e instanceof Error && e.message != "Establishment not found") {
                throw e;
            }
        }

        const etablissementDto = {
            ...etablissement,
            association,
            demandes_subventions: demandes_subventions,
            versements: []
        };
        return await versementsService.aggregateVersementsByEtablissementSearch(etablissementDto);
    }

    public async getAssociationsKeys(value: string) {
        return await associationNameService.getAllStartingWith(value);
    }
}

const searchService = new SearchService();

export default searchService;
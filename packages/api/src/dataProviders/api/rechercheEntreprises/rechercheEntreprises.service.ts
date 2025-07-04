import { NotAssociationError } from "core";
import associationHelper from "../../../modules/associations/associations.helper";
import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";
import rechercheEntreprisesPort from "./rechercheEntreprises.port";
import { RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";

export class RechercheEntreprisesService {
    async searchForceAsso(query: string): Promise<AssociationNameEntity[]> {
        const apiResults = await rechercheEntreprisesPort.search(query);
        const results: AssociationNameEntity[] = [];
        let foundCompany = false;

        for (const structure of apiResults) {
            if (!structure.nom_complet || !structure.siren) continue;
            if (!associationHelper.isCategoryFromAsso(structure.nature_juridique)) {
                foundCompany = true;
                continue;
            }
            const dto = structure as RechercheEntreprisesResultDto & { siren: string; nom_complet: string }; // tell ts that the new typing is good
            results.push(RechercheEntreprisesAdapter.toAssociationNameEntity(dto));
        }
        if (!results.length && foundCompany) throw new NotAssociationError();
        return results;
    }
}

const rechercheEntreprisesService = new RechercheEntreprisesService();
export default rechercheEntreprisesService;

import { SearchCodeError } from "dto";
import associationsService from "../../../modules/associations/associations.service";
import { BadRequestError } from "../../../shared/errors/httpErrors";
import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";
import rechercheEntreprisesPort from "./rechercheEntreprises.port";
import { RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";

export class RechercheEntreprisesService {
    async search(query: string, forceAsso = false): Promise<AssociationNameEntity[]> {
        const apiResults = await rechercheEntreprisesPort.search(query);
        const results: AssociationNameEntity[] = [];
        let foundCompany = false;

        for (const hit of apiResults) {
            if (!hit.nom_complet || !hit.siren) continue;
            if (forceAsso && !associationsService.isCategoryFromAsso(hit.nature_juridique)) {
                foundCompany = true;
                continue;
            }
            const dto = hit as RechercheEntreprisesResultDto & { siren: string; nom_complet: string }; // tell ts that the new typing is good
            results.push(RechercheEntreprisesAdapter.toAssociationNameEntity(dto));
        }
        if (forceAsso && !results.length && foundCompany)
            throw new BadRequestError(
                "Votre recherche pointe vers une entité qui n'est pas une association",
                SearchCodeError.ID_NOT_ASSO,
            );
        return results;
    }
}

const rechercheEntreprisesService = new RechercheEntreprisesService();
export default rechercheEntreprisesService;

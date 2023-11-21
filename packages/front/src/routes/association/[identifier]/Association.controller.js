import { isAssociation } from "$lib/helpers/entrepriseHelper";
import associationService from "$lib/resources/associations/association.service";
import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";

export class AssociationController {
    constructor(identifier) {
        this.associationPromise = associationService.getAssociation(identifier).then(asso => {
            currentAssociation.set(asso);
            return asso;
        });
        this.simplifiedEstablishmentPromise = associationService
            .getEstablishments(identifier)
            .then(estabs => currentAssoSimplifiedEtabs.set(estabs));
        this.titles = ["Tableau de bord" /**, "Statistiques"*/, "Pièces administratives", "Établissements", "Bodacc"];
    }

    isAssociation(association) {
        return !!association.rna || isAssociation(association.categorie_juridique);
    }
}

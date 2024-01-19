import { isAssociation } from "$lib/resources/associations/association.helper";
import associationService from "$lib/resources/associations/association.service";
import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";

export class AssociationController {
    titles = [
        "Subventions",
        /**, "Statistiques",*/
        "Pièces administratives",
        "Établissements",
        "Bodacc",
    ];

    constructor(identifier) {
        this.associationPromise = associationService.getAssociation(identifier).then(asso => {
            currentAssociation.set(asso);
            return asso;
        });
        this.simplifiedEstablishmentPromise = associationService
            .getEstablishments(identifier)
            .then(estabs => currentAssoSimplifiedEtabs.set(estabs));
    }

    get isAssociation() {
        return isAssociation(currentAssociation.value);
    }
}

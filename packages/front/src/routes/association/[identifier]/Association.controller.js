import { isAssociation } from "$lib/helpers/entrepriseHelper";
import associationService from "$lib/resources/associations/association.service";

export class AssociationController {
    constructor(identifier) {
        this.promise = associationService.getAssociation(identifier);
        this.titles = ["Tableau de bord" /**, "Statistiques"*/, "Pièces administratives", "Établissements", "Bodacc"];
    }

    isAssociation(association) {
        return !!association?.rna || isAssociation(association?.categorie_juridique);
    }
}

import { activeBlueBanner } from "$lib/store/context.store";
import { isAssociation } from "$lib/helpers/entrepriseHelper";
import associationService from "$lib/resources/associations/association.service";

export class AssociationController {
    constructor(identifier) {
        activeBlueBanner();
        this.association = associationService.getAssociation(identifier);
        this.titles = ["Tableau de bord" /**, "Statistiques"*/, "Pièces administratives", "Établissements", "Bodacc"];
    }

    isAssociation() {
        return !this.association.rna && !isAssociation(this.association.categorie_juridique);
    }
}

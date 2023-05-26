import { activeBlueBanner } from "@store/context.store";
import { isAssociation } from "@helpers/entrepriseHelper";
import associationService from "@resources/associations/association.service";

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

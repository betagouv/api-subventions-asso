import type { Rna, Siren } from "dto";
import Store from "$lib/core/Store";
import { isAssociation } from "$lib/resources/associations/association.helper";
import associationService from "$lib/resources/associations/association.service";
import rnaSirenService from "$lib/resources/open-source/rna-siren/rna-siren.service";
import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";

export class AssociationController {
    titles = [
        "Tableau de bord",
        /**, "Statistiques",*/
        "Pièces administratives",
        "Établissements",
        "Bodacc",
    ];

    duplicatesFromRna: Store<null | Siren[]>;
    duplicatesFromSiren: Store<null | Rna[]>;
    associationPromise: Promise<unknown>;
    simplifiedEstablishmentPromise: Promise<unknown>;

    constructor(identifier) {
        this.duplicatesFromRna = new Store(null);
        this.duplicatesFromSiren = new Store(null);
        this.associationPromise = associationService.getAssociation(identifier).then(asso => {
            if (!asso) return asso;
            this.getRnaSirenDuplicates(asso.rna, asso.siren);
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

    getRnaSirenDuplicates(rna, siren) {
        rnaSirenService.getAssociatedIdentifier(rna).then(mapping => {
            if (mapping.length > 1) {
                this.duplicatesFromRna.set(mapping.map(rnaSiren => rnaSiren.siren));
            }
        });
        rnaSirenService.getAssociatedIdentifier(siren).then(mapping => {
            if (mapping.length > 1) {
                this.duplicatesFromSiren.set(mapping.map(rnaSiren => rnaSiren.rna));
            }
        });
    }
}

import type { RnaDto, SirenDto } from "dto";
import { onDestroy } from "svelte";
import Store from "$lib/core/Store";
import { isAssociation } from "$lib/resources/associations/association.helper";
import associationService from "$lib/resources/associations/association.service";
import rnaSirenService from "$lib/resources/open-source/rna-siren/rna-siren.service";
import {
    cleanStores,
    currentAssociation,
    currentAssoSimplifiedEtabs,
    currentIdentifiers,
} from "$lib/store/association.store";
import { isAssociationIdentifier } from "$lib/helpers/identifierHelper";
import { goToUrl } from "$lib/services/router.service";

export class AssociationController {
    titles = [
        "Subventions",
        /**, "Statistiques",*/
        "Pièces administratives",
        "Établissements",
        "BODACC",
    ];

    duplicatesFromRna: Store<null | SirenDto[]>;
    duplicatesFromSiren: Store<null | RnaDto[]>;
    associationPromise: Promise<unknown>;
    simplifiedEstablishmentPromise: Promise<unknown>;

    constructor(identifier) {
        if (!isAssociationIdentifier(identifier)) goToUrl(`/etablissement/${identifier}`);

        this.duplicatesFromRna = new Store(null);
        this.duplicatesFromSiren = new Store(null);

        this.associationPromise = associationService.getAssociation(identifier).then(async asso => {
            if (!asso) return asso;
            currentIdentifiers.set([
                // Keep only the current identifier because we are sure is not a duplicate identifier (case for "Doublon rna siren")
                {
                    rna: asso.rna === identifier ? identifier : null,
                    siren: asso.siren === identifier ? identifier : null,
                },
            ]);
            this.getRnaSirenDuplicates(asso.rna, asso.siren);
            currentAssociation.set(asso);
            return asso;
        });
        this.simplifiedEstablishmentPromise = associationService
            .getEstablishments(identifier)
            .then(estabs => currentAssoSimplifiedEtabs.set(estabs));

        // when component is destroyed we want to reset those stores
        onDestroy(() => {
            cleanStores();
        });
    }

    get isAssociation() {
        return isAssociation(currentAssociation.value);
    }

    getRnaSirenDuplicates(rna, siren) {
        if (rna) {
            rnaSirenService.getAssociatedIdentifier(rna).then(mapping => {
                if (mapping.length > 1) {
                    this.duplicatesFromRna.set(mapping.map(rnaSiren => rnaSiren.siren));
                }
            });
        }

        if (siren) {
            rnaSirenService.getAssociatedIdentifier(siren).then(mapping => {
                if (mapping.length > 1) {
                    this.duplicatesFromSiren.set(mapping.map(rnaSiren => rnaSiren.rna));
                }
            });
        }
    }
}

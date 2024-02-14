import type { Siret } from "dto";
import { goto } from "$app/navigation";
import Store from "$lib/core/Store";
import { returnInfinitPromise } from "$lib/helpers/promiseHelper";
import { decodeQuerySearch, encodeQuerySearch } from "$lib/helpers/urlHelper";
import { isRna, isSiren, isSiret } from "$lib/helpers/identifierHelper";
import associationService from "$lib/resources/associations/association.service";

export default class SearchController {
    inputSearch: Store<string>;
    associations: Store<unknown[]>;
    searchPromise: Store<Promise<unknown>>;
    duplicatesFromIdentifier: Store<string[] | null>;

    constructor(name) {
        this.inputSearch = new Store(decodeQuerySearch(name));
        this.associations = new Store([]);
        this.searchPromise = new Store(returnInfinitPromise());
        this.searchPromise.set(this.fetchAssociationFromName(name));
        this.duplicatesFromIdentifier = new Store(null);
    }

    fetchAssociationFromName(name) {
        return associationService.search(name).then(associations => {
            if ((isSiren(name) || isRna(name)) && associations.length === 1) {
                goto(`/association/${associations[0].siren || associations[0].rna}`, { replaceState: true });
            } else {
                // display alert if there are duplicates in rna-siren links
                if (isSiren(name) || isRna(name)) {
                    this.duplicatesFromIdentifier.set(
                        associations.map(association =>
                            [association.rna, association.siren].find(identifier => identifier !== name),
                        ),
                    );
                } else this.duplicatesFromIdentifier.set(null);
                this.associations.set(associations);
                // reload same page to save search in history
                goto(`/search/${name}`, { replaceState: true });
            }
        });
    }

    gotoEstablishment(siret: Siret) {
        goto(`/etablissement/${siret}`);
    }

    updateNbEtabsLabel() {
        const nbAssos = this.associations.value.length;
        return nbAssos > 1 ? `${nbAssos} résultats trouvés.` : `${nbAssos} résultat trouvé.`;
    }

    onSubmit(input) {
        this.inputSearch.set(input);
        if (isSiret(input)) {
            this.gotoEstablishment(input);
        } else {
            const encodedValue = encodeQuerySearch(input);
            this.searchPromise.set(this.fetchAssociationFromName(encodedValue));
        }
    }
}

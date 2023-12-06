import type { Siret } from "dto";
import { goto } from "$app/navigation";
import Store from "$lib/core/Store";
import { returnInfinitPromise } from "$lib/helpers/promiseHelper";
import { decodeQuerySearch, encodeQuerySearch } from "$lib/helpers/urlHelper";
import { isSiret } from "$lib/helpers/validatorHelper";
import associationService from "$lib/resources/associations/association.service";

export default class SearchController {
    associations: Store<unknown[]>;
    searchPromise: Store<Promise<unknown>>;
    inputSearch: Store<string>;

    constructor(name) {
        this.inputSearch = new Store(decodeQuerySearch(name));
        this.associations = new Store([]);
        this.searchPromise = new Store(returnInfinitPromise());
        this.searchPromise.set(this.fetchAssociationFromName(name));
    }

    fetchAssociationFromName(name) {
        return associationService.search(name).then(associations => {
            if (associations.length === 1) {
                goto(`/association/${associations[0].siren || associations[0].rna}`, { replaceState: true });
            } else {
                this.associations.set(associations);
                goto(`/search/${this.inputSearch.value}`, { replaceState: true });
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

    onSubmit() {
        if (isSiret(this.inputSearch.value)) {
            this.gotoEstablishment(this.inputSearch.value);
        } else {
            const encodedValue = encodeQuerySearch(this.inputSearch.value);
            this.searchPromise.set(this.fetchAssociationFromName(encodedValue));
        }
    }
}

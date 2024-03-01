import type { PaginatedAssociationNameDto, Siret } from "dto";
import { goto } from "$app/navigation";
import Store from "$lib/core/Store";
import { returnInfinitPromise } from "$lib/helpers/promiseHelper";
import { decodeQuerySearch, encodeQuerySearch } from "$lib/helpers/urlHelper";
import { isRna, isSiren, isSiret } from "$lib/helpers/identifierHelper";
import associationService from "$lib/resources/associations/association.service";

export default class SearchController {
    inputSearch: Store<string>;
    associations = new Store<PaginatedAssociationNameDto>({ nbPages: 1, page: 1, totalResults: 0, results: [] });
    searchPromise: Store<Promise<unknown>>;
    duplicatesFromIdentifier: Store<string[] | null>;
    currentPage = new Store(1);

    constructor(name) {
        this.inputSearch = new Store(decodeQuerySearch(name));
        this.searchPromise = new Store(returnInfinitPromise());
        this.duplicatesFromIdentifier = new Store(null);
        this.currentPage.subscribe(newPage => this.searchPromise.set(this.fetchAssociationFromName(name, newPage)));
    }

    async fetchAssociationFromName(name = "", page = 1) {
        const associations = await associationService.search(name, page);
        if ((isSiren(name) || isRna(name)) && associations.totalResults === 1) {
            const asso = associations.results[0];
            return goto(`/association/${asso.siren || asso.rna}`, { replaceState: true });
        } else {
            // display alert if there are duplicates in rna-siren links
            if (isSiren(name) || isRna(name)) {
                this.duplicatesFromIdentifier.set(
                    associations.results
                        .map(association =>
                            [association.rna, association.siren].find(identifier => identifier !== name),
                        )
                        .filter(identifier => identifier) as string[],
                );
            } else this.duplicatesFromIdentifier.set(null);

            this.associations.set(associations);
            this.currentPage.set(associations.page);
            // reload same page to save search in history
            goto(`/search/${name}`, { replaceState: true });
        }
    }

    gotoEstablishment(siret: Siret) {
        goto(`/etablissement/${siret}`);
    }

    updateNbEtabsLabel() {
        const nbAssos = this.associations.value.totalResults;
        return nbAssos > 1 ? `${nbAssos} résultats trouvés.` : `${nbAssos} résultat trouvé.`;
    }

    onSubmit(input: string) {
        this.inputSearch.set(input);
        if (isSiret(input)) {
            this.gotoEstablishment(input);
        } else {
            const encodedValue = encodeQuerySearch(input);
            this.searchPromise.set(this.fetchAssociationFromName(encodedValue, 1));
        }
    }
}

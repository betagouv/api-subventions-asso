import type { PaginatedAssociationNameDto, Siret } from "dto";
import { goto } from "$app/navigation";
import Store from "$lib/core/Store";
import { returnInfinitePromise } from "$lib/helpers/promiseHelper";
import { decodeQuerySearch, encodeQuerySearch } from "$lib/helpers/urlHelper";
import { isRna, isSiren, isSiret } from "$lib/helpers/identifierHelper";
import associationService from "$lib/resources/associations/association.service";
import { isAssociation } from "$lib/resources/associations/association.helper";

export default class SearchController {
    inputSearch: Store<string | undefined>;
    associations = new Store<PaginatedAssociationNameDto>({ nbPages: 1, page: 1, total: 0, results: [] });
    searchPromise: Store<Promise<unknown>>;
    duplicatesFromIdentifier: Store<string[] | null>;
    currentPage = new Store(1);
    isLastSearchCompany = new Store(false);

    constructor(name = "") {
        this.inputSearch = new Store(decodeQuerySearch(name));
        this.duplicatesFromIdentifier = new Store(null);
        this.searchPromise = new Store(returnInfinitePromise());
        this.searchPromise.set(this.fetchAssociationFromName(name));
    }

    async fetchAssociationFromName(name = "", page = 1) {
        this.isLastSearchCompany.set(false);
        const search = await associationService.search(name, page);
        if ((isSiren(name) || isRna(name)) && search.total === 1) {
            const asso = search.results[0];
            if (isAssociation(asso)) return goto(`/association/${asso.siren || asso.rna}`, { replaceState: true });
            else this.isLastSearchCompany.set(true);
        } else {
            // display alert if there are duplicates in rna-siren links
            if (isSiren(name) || isRna(name)) {
                this.duplicatesFromIdentifier.set(
                    search.results
                        .map(association =>
                            [association.rna, association.siren].find(identifier => identifier !== name),
                        )
                        .filter(identifier => identifier) as string[],
                );
            } else this.duplicatesFromIdentifier.set(null);

            this.associations.set(search);
            this.currentPage.set(search.page);
            // reload same page to save search in history
            goto(`/search/${encodeQuerySearch(name)}`, { replaceState: true });
        }
    }

    gotoEstablishment(siret: Siret) {
        goto(`/etablissement/${siret}`);
    }

    updateNbEtabsLabel() {
        const nbAssos = this.associations.value.total;
        return nbAssos > 1 ? `${nbAssos} résultats trouvés.` : `${nbAssos} résultat trouvé.`;
    }

    onSubmit(input: string) {
        this.inputSearch.set(input);
        if (isSiret(input)) {
            this.gotoEstablishment(input);
        } else {
            this.searchPromise.set(this.fetchAssociationFromName(input, 1));
        }
    }

    onChangePage(event: { detail: number }) {
        this.searchPromise.set(this.fetchAssociationFromName(this.inputSearch.value, event.detail));
    }
}

import { goto } from "$app/navigation";
import Store from "$lib/core/Store";
import { returnInfinitePromise } from "$lib/helpers/promiseHelper";
import { decodeQuerySearch, encodeQuerySearch } from "$lib/helpers/urlHelper";
import { isRna, isSiren } from "$lib/helpers/identifierHelper";
import associationService, {
    type PaginatedAssociationSearchResult,
} from "$lib/resources/associations/association.service";
import { removeWhiteSpace } from "$lib/helpers/stringHelper";
import type { SearchSort } from "$lib/resources/associations/association.port";

export default class SearchController {
    inputSearch: Store<string>;
    searchResults = new Store<PaginatedAssociationSearchResult>({
        nbPages: 1,
        page: 1,
        total: 0,
        results: [],
    });
    searchPromise: Store<Promise<unknown>>;
    duplicatesFromIdentifier: Store<string[] | null>;
    currentPage = new Store(1);
    isLastSearchCompany = new Store(false);
    postalCode: Store<string>;
    selectedSort: Store<SearchSort>;
    nameOnly: Store<boolean>;

    constructor(name = "", postalCode?: string, sort: SearchSort = "relevance", nameOnly = false) {
        this.inputSearch = new Store(decodeQuerySearch(name).trim());
        this.postalCode = new Store(postalCode ?? "");
        this.selectedSort = new Store(sort);
        this.nameOnly = new Store(nameOnly);
        this.duplicatesFromIdentifier = new Store(null);
        this.searchPromise = new Store(returnInfinitePromise());
        this.searchPromise.set(this.fetchAssociations());
    }

    async fetchAssociations(page = 1) {
        const input = this.inputSearch.value.trim();
        const inputId = removeWhiteSpace(input);
        const isAssociationIdSearch = isSiren(inputId) || isRna(inputId);
        this.isLastSearchCompany.set(false);
        try {
            const search = await associationService.search(
                input,
                page,
                this.postalCode.value || undefined,
                this.selectedSort.value,
                this.nameOnly.value,
            );

            // display alert if there are duplicates in rna-siren links
            if (isAssociationIdSearch) {
                const duplicates = search.results.flatMap(association => {
                    const identifier = [association.rna, association.siren].find(id => id && id !== inputId);
                    return identifier ? [identifier] : [];
                });
                this.duplicatesFromIdentifier.set(duplicates.length ? duplicates : null);
            } else this.duplicatesFromIdentifier.set(null);

            this.searchResults.set(search);
            this.currentPage.set(search.page);
            // reload same page to save search in history
            goto(this.getSearchUrl(), { replaceState: true });
        } catch (e) {
            if ((e as { httpCode?: number }).httpCode === 422) this.isLastSearchCompany.set(true);
        }
    }

    getSearchUrl() {
        const params = new URLSearchParams();
        if (this.postalCode.value) params.set("postalCode", this.postalCode.value);
        if (this.selectedSort.value !== "relevance") params.set("sort", this.selectedSort.value);
        if (this.nameOnly.value) params.set("nameOnly", "true");
        const query = params.toString();

        return `/search/${encodeQuerySearch(this.inputSearch.value)}${query ? `?${query}` : ""}`;
    }

    updateNbEtabsLabel() {
        const nbAssos = this.searchResults.value.total;
        return nbAssos > 1 ? `${nbAssos} résultats trouvés` : `${nbAssos} résultat trouvé`;
    }

    onSubmit(input: string, postalCode?: string, nameOnly = false) {
        this.postalCode.set(postalCode ?? "");
        this.inputSearch.set(input.trim());
        this.nameOnly.set(nameOnly);
        this.searchPromise.set(this.fetchAssociations());
    }

    selectPage(page: number) {
        this.searchPromise.set(this.fetchAssociations(page));
    }

    selectSort(sort: SearchSort) {
        this.selectedSort.set(sort);
        this.searchPromise.set(this.fetchAssociations());
    }
}

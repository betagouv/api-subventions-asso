import type { PaginatedAssociationNameDto, SiretDto } from "dto";
import { goto } from "$app/navigation";
import Store from "$lib/core/Store";
import { returnInfinitePromise } from "$lib/helpers/promiseHelper";
import { decodeQuerySearch, encodeQuerySearch } from "$lib/helpers/urlHelper";
import { isRna, isSiren, isSiret } from "$lib/helpers/identifierHelper";
import associationService from "$lib/resources/associations/association.service";
import { removeWhiteSpace } from "$lib/helpers/stringHelper";

export default class SearchController {
    inputSearch: Store<string | undefined>;
    associations = new Store<PaginatedAssociationNameDto>({ nbPages: 1, page: 1, total: 0, results: [] });
    searchPromise: Store<Promise<unknown>>;
    duplicatesFromIdentifier: Store<string[] | null>;
    currentPage = new Store(1);
    isLastSearchCompany = new Store(false);

    constructor(name = "") {
        this.inputSearch = new Store(decodeQuerySearch(name).trim());
        this.duplicatesFromIdentifier = new Store(null);
        this.searchPromise = new Store(returnInfinitePromise());
        this.searchPromise.set(this.fetchAssociationFromName(name));
    }

    async fetchAssociationFromName(rawInput = "", page = 1) {
        const input = rawInput.trim();
        const inputId = removeWhiteSpace(rawInput);
        const isSiretSearch = isSiret(inputId);
        const isAssociationIdSearch = isSiren(inputId) || isRna(inputId);
        this.isLastSearchCompany.set(false);
        try {
            const search = await associationService.search(input, page);

            // search by id with single result: we can redirect
            if (isSiretSearch && search.total === 1) return this.gotoEstablishment(inputId);
            if (isAssociationIdSearch && search.total === 1) {
                return goto(`/association/${inputId}`, { replaceState: true });

                // multiple results
            } else {
                // display alert if there are duplicates in rna-siren links
                if (isAssociationIdSearch) {
                    const duplicates = search.results
                        .map(association => [association.rna, association.siren].find(id => id && id !== inputId))
                        .filter(identifier => identifier) as string[];
                    this.duplicatesFromIdentifier.set(duplicates.length ? duplicates : null);
                } else this.duplicatesFromIdentifier.set(null);

                // search by name
                this.associations.set(search);
                this.currentPage.set(search.page);
                // reload same page to save search in history
                goto(`/search/${encodeQuerySearch(input)}`, { replaceState: true });
            }
        } catch (e) {
            if ((e as { httpCode?: number }).httpCode === 422) this.isLastSearchCompany.set(true);
        }
    }

    gotoEstablishment(siret: SiretDto) {
        goto(`/etablissement/${removeWhiteSpace(siret)}`, { replaceState: true });
    }

    updateNbEtabsLabel() {
        const nbAssos = this.associations.value.total;
        return nbAssos > 1 ? `${nbAssos} résultats trouvés.` : `${nbAssos} résultat trouvé.`;
    }

    onSubmit(input?: string) {
        if (!input) return;
        const trimmedInput = input.trim();
        this.inputSearch.set(trimmedInput);
        this.searchPromise.set(this.fetchAssociationFromName(trimmedInput, 1));
    }

    onChangePage(event: { detail: number }) {
        this.searchPromise.set(this.fetchAssociationFromName(this.inputSearch.value, event.detail));
    }
}

import type { PaginatedAssociationNameDto, Siret } from "dto";
import { SearchCodeError } from "dto";
import { goto } from "$app/navigation";
import Store from "$lib/core/Store";
import { returnInfinitePromise } from "$lib/helpers/promiseHelper";
import { decodeQuerySearch, encodeQuerySearch } from "$lib/helpers/urlHelper";
import { isRna, isSiren, isSiret } from "$lib/helpers/identifierHelper";
import associationService from "$lib/resources/associations/association.service";
import { removeWhiteSpace } from "$lib/helpers/stringHelper";
import { BadRequestError } from "$lib/errors";

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
        this.isLastSearchCompany.set(false);
        try {
            const search = await associationService.search(input, page);

            // search by id with single result: we can redirect
            if (isSiret(input) && search.total === 1) return this.gotoEstablishment(input);
            if ((isSiren(input) || isRna(input)) && search.total === 1) {
                return goto(`/association/${input}`, { replaceState: true });

                // multiple results
            } else {
                // display alert if there are duplicates in rna-siren links
                if (isSiren(input) || isRna(input)) {
                    this.duplicatesFromIdentifier.set(
                        search.results
                            .map(association =>
                                [association.rna, association.siren].find(identifier => identifier !== input),
                            )
                            .filter(identifier => identifier) as string[],
                    );
                } else this.duplicatesFromIdentifier.set(null);

                // search by name
                this.associations.set(search);
                this.currentPage.set(search.page);
                // reload same page to save search in history
                goto(`/search/${encodeQuerySearch(input)}`, { replaceState: true });
            }
        } catch (e) {
            if (e instanceof BadRequestError && e.data?.code === SearchCodeError.ID_NOT_ASSO)
                this.isLastSearchCompany.set(true);
        }
    }

    gotoEstablishment(siret: Siret) {
        goto(`/etablissement/${removeWhiteSpace(siret)}`, { replaceState: true });
    }

    updateNbEtabsLabel() {
        const nbAssos = this.associations.value.total;
        return nbAssos > 1 ? `${nbAssos} résultats trouvés.` : `${nbAssos} résultat trouvé.`;
    }

    onSubmit(input: string) {
        const trimmedInput = input.trim();
        this.inputSearch.set(trimmedInput);
        this.searchPromise.set(this.fetchAssociationFromName(trimmedInput, 1));
    }

    onChangePage(event: { detail: number }) {
        this.searchPromise.set(this.fetchAssociationFromName(this.inputSearch.value, event.detail));
    }
}

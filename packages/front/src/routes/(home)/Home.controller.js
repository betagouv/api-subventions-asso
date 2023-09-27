import { debounce } from "lodash/function";
import { getSearchHistory } from "$lib/services/searchHistory.service.js";
import { isRna, isSiren, isSiret, isStartOfSiret } from "$lib/helpers/validatorHelper";
import Store from "$lib/core/Store";
import associationService from "$lib/resources/associations/association.service";
import { goto } from "$app/navigation";

export class HomeController {
    constructor(query = {}) {
        this.isLoading = new Store(false);
        this.searchResult = new Store([]);
        this.searchHistory = getSearchHistory();
        this.input = new Store("");
        this._searchCache = new Map();
        this.currentSearch = new Store(null);
        this.successMessage = query.success;
    }

    onInput(input) {
        if (input.length < 3) return;

        this._debouncedInitSearch();
        this._debouncedPerformSearch(input);
    }

    _initSearch() {
        if (!this.isLoading.value) this.isLoading.set(true);
    }

    _debouncedInitSearch = debounce(() => this._initSearch());

    _performSearch(text) {
        text = this._removeSpaceFromIdentifier(text);

        // nothing to do if we are already searching for the same text
        if (text === this.currentSearch.value?.text) return;

        this.currentSearch.set({
            promise: this._searchAndCache(text).then(result => this._finishSearch(text, result)),
            text,
        });
    }

    _debouncedPerformSearch = debounce(text => this._performSearch(text), 1000);

    _finishSearch(text, result) {
        if (text !== this.currentSearch.value?.text) return;
        this.isLoading.set(false);
        this.searchResult.set(result || []);
        return result;
    }

    onSubmit() {
        if (isRna(this.input.value) || isSiren(this.input.value)) {
            goto(`/association/${this.input.value}`);
        } else if (isSiret(this.input.value)) {
            goto(`/etablissement/${this.input.value}`);
        } else if (this.searchResult.value?.length) {
            goto(`/association/${this.searchResult.value[0].rna || this.searchResult.value[0].siren}`);
        }
    }

    async _searchAndCache(searchedText) {
        if (this._searchCache.has(searchedText)) return this._searchCache.get(searchedText);
        const result = (await associationService.search(searchedText)).slice(0, 20);
        this._searchCache.set(searchedText, result);
        return result;
    }

    _removeSpaceFromIdentifier(text) {
        const textWithoutSpace = text.replaceAll(" ", "");
        if (isStartOfSiret(textWithoutSpace) || isRna(textWithoutSpace)) return textWithoutSpace;
        return text;
    }
}

import InterruptSearchError from "./error/InterruptSearchError";
import homeService from "./home.service";
import debounceFactory from "@helpers/timeHelper";
import { getSearchHistory } from "@services/storage.service";
import { isRna, isSiren, isSiret, isStartOfSiret } from "@helpers/validatorHelper";
import Store from "@core/Store";

export class HomeController {
    constructor() {
        this.error = new Store(!!new URLSearchParams(location.search).get("error"));
        this.isLoading = new Store(false);
        this.searchResult = [];
        this.searchHistory = getSearchHistory();
        this.input = new Store("");
    }

    debounce = debounceFactory(200);

    onInput(input) {
        return this._searchAssociation(input);
    }

    async _searchAssociation(text) {
        this.error.set(false);
        this.searchResult.length = 0;

        if (text.length < 3) return;

        if (isStartOfSiret(text.replace(" ", ""))) text = text.replace(" ", "");

        try {
            this.isLoading.set(true);
            this.searchResult = await homeService.search(text);
        } catch (e) {
            if (e instanceof InterruptSearchError) return;

            this.error.set(true);
        }
        this.isLoading.set(false);
    }

    onSubmit() {
        if (isRna(this.input) || isSiren(this.input)) {
            location.href = `/association/${this.input}`;
        } else if (isSiret(this.input)) {
            location.href = `/etablissement/${this.input}`;
        } else if (this.searchResult.length !== 0) {
            location.href = `/association/${this.searchResult[0].rna || this.searchResult[0].siren}`;
        }
    }
}

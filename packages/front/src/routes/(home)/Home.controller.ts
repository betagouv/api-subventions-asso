import type { ReadStore } from "$lib/core/Store";
import { getSearchHistory } from "$lib/services/searchHistory.service";
import { goto } from "$app/navigation";
import { encodeQuerySearch } from "$lib/helpers/urlHelper";
import type { SearchHistory } from "$lib/types/SearchHistory";

export class HomeController {
    searchHistory: ReadStore<SearchHistory[]>;
    successMessage: { title: string; content: string } | undefined;

    constructor(query: { [k: string]: string } = {}) {
        this.searchHistory = getSearchHistory();
        this.successMessage = this._getSuccessMessage(query.success);
    }

    onSubmit(input) {
        goto(`/search/${encodeQuerySearch(input)}`);
    }

    _getSuccessMessage(successKey) {
        if (!successKey) return undefined;
        if (successKey === "ACCOUNT_ACTIVATED")
            return {
                title: "Bravo, votre compte a été créé !",
                content: "Vous pouvez commencer à effectuer vos recherches",
            };
        if (successKey === "PWD_RESET")
            return {
                title: "Bravo, votre mot de passe a bien été modifié !",
                content: "",
            };
    }
}

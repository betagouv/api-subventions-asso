import { getSearchHistory } from "$lib/services/searchHistory.service";
import Store from "$lib/core/Store";
import { goto } from "$app/navigation";
import { encodeQuerySearch } from "$lib/helpers/urlHelper";

export class HomeController {
    constructor(query = {}) {
        this.searchHistory = getSearchHistory();
        this.input = new Store("");
        this.successMessage = this._getSuccessMessage(query.success);
    }

    onSubmit() {
        goto(`/search/${encodeQuerySearch(this.input.value)}`);
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

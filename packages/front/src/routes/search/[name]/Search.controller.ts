import { goto } from "$app/navigation";
import Store from "$lib/core/Store";
import { returnInfinitPromise } from "$lib/helpers/promiseHelper";
import associationService from "$lib/resources/associations/association.service";

export default class SearchController {
    associations: Store<any>;
    searchPromise: Store<Promise<any>>;
    inputSearch: Store<string>;

    constructor(name) {
        console.log("coucou");
        this.inputSearch = new Store("");
        this.associations = new Store([]);
        this.searchPromise = new Store(returnInfinitPromise());
        this.searchPromise.set(this.fetchAssociationFromName(name));
    }

    fetchAssociationFromName(name) {
        return associationService.search(name).then(associations => this.associations.set(associations));
    }

    onSubmit() {
        this.searchPromise.set(this.fetchAssociationFromName(this.inputSearch.value));
        return goto(`/search/${this.inputSearch.value}`, { replaceState: true });
    }
}

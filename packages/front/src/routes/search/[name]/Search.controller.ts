import Store from "$lib/core/Store";

export default class SearchController {
    searchResult: Store<any>;
    constructor(name) {
        this.searchResult = new Store([]);
    }
}

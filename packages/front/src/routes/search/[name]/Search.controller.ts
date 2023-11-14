// import HtmlSanitizer from "jitbit-html-sanitizer";
import Store from "$lib/core/Store";
import { returnInfinitPromise } from "$lib/helpers/promiseHelper";
import associationService from "$lib/resources/associations/association.service";

export default class SearchController {
    associations: Store<any>;
    searchPromise: Store<Promise<any>>;
    inputSearch: Store<string>;

    constructor(name) {
        this.inputSearch = new Store("");
        this.associations = new Store([]);
        this.searchPromise = new Store(returnInfinitPromise());
        this.searchPromise.set(this.fetchAssociationFromName(name));
    }

    fetchAssociationFromName(name) {
        // const sanitizer = new HtmlSanitizer();

        // const sanitizedName = sanitizer.sanitizeHtml(name);

        return associationService.search(name).then(associations =>
            this.associations.set(
                associations.map(association => {
                    const { rna, siren, name } = association;
                    return { rna, siren, name };
                }),
            ),
        );
    }

    onSubmit() {
        this.searchPromise.set(this.fetchAssociationFromName(this.inputSearch.value));
    }
}

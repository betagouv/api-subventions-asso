<script>
    import _ from "lodash";
    import { stringSimilarity } from "string-similarity-js";

    export let users;

    let search = "";
    const _updateSearch = () => {
        if (search.length < 2) return;

        const searchString = search.toLowerCase();

        users = users.sort((userA, userB) => {
            if (searchString.length <= 0) {
                return 1;
            }

            return (
                stringSimilarity(searchString, userB.email.toLowerCase()) -
                stringSimilarity(searchString, userA.email.toLowerCase())
            );
        });
    };

    const updateSearch = _.debounce(_updateSearch, 200);

    $: search, updateSearch();
</script>

<div class="fr-col fr-col-lg-12">
    <div class="fr-search-bar fr-mr-4w" role="search">
        <label class="fr-label" for="admin-search-input">Recherche</label>
        <input
            type="text"
            bind:value={search}
            placeholder="Recherche par email (insensible à la casse)"
            name="admin-search-input"
            class="fr-input" />
        <button class="fr-btn" title="Rechercher">Rechercher</button>
    </div>
</div>

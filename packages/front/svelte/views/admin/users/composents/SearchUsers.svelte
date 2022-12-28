<script>
    import { compareTwoStrings } from "string-similarity";

    export let users;

    let search = "";
    const updateSearch = () => {
        if (search.length < 2) return;

        const searchString = search.toLowerCase();

        users = users.sort((userA, userB) => {
            if (searchString.length <= 0) {
                return 1;
            }

            return (
                compareTwoStrings(searchString, userB.email.toLowerCase()) -
                compareTwoStrings(searchString, userA.email.toLowerCase())
            );
        });
    };

    $: search, updateSearch();
</script>

<div class="fr-col fr-col-lg-12">
    <div class="fr-search-bar" role="search">
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

<style>
    .fr-search-bar {
        width: 90%;
    }
</style>

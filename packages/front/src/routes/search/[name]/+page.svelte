<script lang="ts">
    import SearchController from "./Search.controller";
    import Spinner from "$lib/components/Spinner.svelte";
    import AssociationCard from "$lib/components/AssociationCard/AssociationCard.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";

    export let data;
    const { name } = data.params;

    const ctrl = new SearchController(name);
    const { searchPromise, associations, inputSearch } = ctrl;
</script>

<div class="search-bar fr-py-6v">
    <SearchBar bind:value={$inputSearch} on:submit={() => ctrl.onSubmit()} />
</div>

{#await $searchPromise}
    <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-12">
            <div class="fr-card__body">
                <Spinner description="Recherche en cours..." />
            </div>
        </div>
    </div>
{:then _result}
    <p class="fr-text-md">{`${$associations.length} résultats trouvés.`}</p>
    <div class="fr-grid-row fr-grid-row--gutters search-layout">
        {#each $associations as simplifiedAsso}
            <AssociationCard {simplifiedAsso} />
        {/each}
    </div>
{/await}

<style>
    .search-layout {
        display: flex;
        flex-wrap: wrap;
        /* gap: 16px; */
    }

    .search-bar {
        margin: auto;
        justify-content: space-around;
        max-width: 792px;
    }
</style>

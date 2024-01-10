<script lang="ts">
    import DuplicateAlert from "../../association/[identifier]/components/DuplicateAlert.svelte";
    import SearchController from "./Search.controller";
    import Spinner from "$lib/components/Spinner.svelte";
    import AssociationCard from "$lib/components/AssociationCard/AssociationCard.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";

    export let data;
    const { name } = data.params;

    const ctrl = new SearchController(name);
    const { searchPromise, associations, inputSearch, duplicatesFromIdentifier } = ctrl;

    let nbResultLabel;
    $: $associations, (nbResultLabel = ctrl.updateNbEtabsLabel());
</script>

<div class="fr-grid-row fr-grid-row--center fr-my-6v">
    <div class="fr-col-8">
        <div class="search-bar">
            <SearchBar bind:value={$inputSearch} on:submit={() => ctrl.onSubmit()} />
        </div>
    </div>
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
    <p class="fr-text-md">
        {nbResultLabel}
    </p>
    {#if $duplicatesFromIdentifier}
        <div class="fr-mb-3w">
            <DuplicateAlert duplicates={$duplicatesFromIdentifier} />
        </div>
    {/if}
    <div class="fr-grid-row fr-grid-row--gutters search-layout">
        {#each $associations as simplifiedAsso}
            <AssociationCard {simplifiedAsso} searchKey={$inputSearch} />
        {/each}
    </div>
{/await}

<style>
    .search-layout {
        display: flex;
        flex-wrap: wrap;
    }
</style>

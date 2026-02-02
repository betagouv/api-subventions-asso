<script lang="ts">
    import DuplicateAlert from "../../association/[identifier]/components/DuplicateAlert.svelte";
    import SearchController from "./Search.controller";
    import Spinner from "$lib/components/Spinner.svelte";
    import AssociationCard from "$lib/components/AssociationCard/AssociationCard.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";
    import Pagination from "$lib/dsfr/Pagination.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";

    export let data;
    const { name } = data.params;

    const ctrl = new SearchController(name);
    const { searchPromise, associations, inputSearch, duplicatesFromIdentifier, currentPage, isLastSearchCompany } =
        ctrl;

    let nbResultLabel;

    // TODO: #3374
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    $: ($associations, (nbResultLabel = ctrl.updateNbEtabsLabel()));
</script>

<div class="fr-grid-row fr-grid-row--center fr-my-6v">
    <div class="fr-col-8">
        <div class="search-bar">
            <SearchBar bind:value={$inputSearch} on:submit={e => ctrl.onSubmit(e.detail)} />
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
{:then}
    {#if $isLastSearchCompany}
        <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-8">
                <Alert title="Il semblerait que vous cherchiez une entreprise et non une association. ">
                    Data.Subvention ne répertorie que les données des associations.
                </Alert>
            </div>
        </div>
    {:else}
        <div class="fr-mb-3w">
            <p class="fr-mb-2w">
                {nbResultLabel}
            </p>
            {#if $associations.nbPages > 1}
                <p class="fr-mb-2w fr-text--bold">
                    Pour faciliter l’affichage des résultats, tapez directement le SIREN ou RNA de l’association
                    recherchée.
                </p>
            {/if}
            {#if $duplicatesFromIdentifier}
                <div>
                    <DuplicateAlert duplicates={$duplicatesFromIdentifier} />
                </div>
            {/if}
        </div>

        <div class="fr-grid-row fr-grid-row--gutters search-layout">
            {#each $associations.results as simplifiedAsso}
                <AssociationCard {simplifiedAsso} searchKey={$inputSearch} />
            {/each}
        </div>

        {#if $associations.nbPages > 1}
            <div class="fr-grid-row fr-mt-5w">
                <div class="fr-mx-auto">
                    <Pagination
                        totalPages={$associations.nbPages}
                        {currentPage}
                        on:change={e => ctrl.onChangePage(e)} />
                </div>
            </div>
        {/if}
    {/if}
{/await}

<style>
    .search-layout {
        display: flex;
        flex-wrap: wrap;
    }
</style>

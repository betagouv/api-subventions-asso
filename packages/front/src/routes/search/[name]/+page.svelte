<script lang="ts">
    import DuplicateAlert from "../../association/[identifier]/components/DuplicateAlert.svelte";
    import SearchController from "./Search.controller";
    import Spinner from "$lib/components/Spinner.svelte";
    import AssociationItem from "$lib/components/AssociationItem/AssociationItem.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";
    import Pagination from "$lib/dsfr/Pagination.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import type { PageProps } from "./$types";

    let { params }: PageProps = $props();
    const name = $derived(params.name);


    const ctrl = $derived(new SearchController(name));
    const searchPromise = $derived(ctrl.searchPromise);
    const searchResults = $derived(ctrl.searchResults);
    const inputSearch = $derived(ctrl.inputSearch);
    const duplicatesFromIdentifier = $derived(ctrl.duplicatesFromIdentifier);
    const currentPage = $derived(ctrl.currentPage);
    const isLastSearchCompany = $derived(ctrl.isLastSearchCompany);

    let nbResultLabel = $state();

    $effect(() => {
        void $searchResults;
        nbResultLabel = ctrl.updateNbEtabsLabel();
    });
</script>

<div class="fr-grid-row fr-grid-row--center fr-my-6v">
    <div class="fr-col-8">
        <div class="search-bar">
            <SearchBar bind:value={$inputSearch} onsubmit={value => ctrl.onSubmit(value)} />
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
            {#if $searchResults.nbPages > 1}
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
            {#each $searchResults.resultats as simplifiedAsso (simplifiedAsso.siren + "-" + simplifiedAsso.rna)}
                <AssociationItem {simplifiedAsso} searchKey={$inputSearch} />
            {/each}
        </div>

        {#if $searchResults.nbPages > 1}
            <div class="fr-grid-row fr-mt-5w">
                <div class="fr-mx-auto">
                    <Pagination totalPages={$searchResults.nbPages} {currentPage} onchange={e => ctrl.onChangePage(e)} />
                </div>
            </div>
        {/if}
    {/if}
{/await}

<style>
    .search-layout {
        display: flex;
        flex-wrap: wrap;
        row-gap: 1rem;
    }
</style>

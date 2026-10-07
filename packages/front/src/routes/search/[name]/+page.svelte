<script lang="ts">
    import DuplicateAlert from "../../association/[identifier]/components/DuplicateAlert.svelte";
    import SearchController from "./Search.controller";
    import Spinner from "$lib/components/Spinner.svelte";
    import AssociationCard from "$lib/components/AssociationCard/AssociationCard.svelte";
    import AdvancedSearchBar from "$lib/components/AdvancedSearchBar/AdvancedSearchBar.svelte";
    import Pagination from "$lib/dsfr/Pagination.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import { page } from "$lib/store/kit.store";
    import type { PageProps } from "./$types";

    let { params }: PageProps = $props();
    const name = $derived(params.name);
    const initialPostalCode = $derived($page.url.searchParams.get("postalCode") ?? undefined);

    const ctrl = $derived(new SearchController(name, initialPostalCode));
    const searchPromise = $derived(ctrl.searchPromise);
    const searchResults = $derived(ctrl.searchResults);
    const inputSearch = $derived(ctrl.inputSearch);
    const duplicatesFromIdentifier = $derived(ctrl.duplicatesFromIdentifier);
    const currentPage = $derived(ctrl.currentPage);
    const isLastSearchCompany = $derived(ctrl.isLastSearchCompany);
    const postalCode = $derived(ctrl.postalCode);

    const nbResultLabel = $derived(($searchResults, ctrl.updateNbEtabsLabel()));
    let selectedSort = $state<"relevance" | "alphabetical">("relevance");
</script>

<div class="fr-my-6v">
    <AdvancedSearchBar
        bind:value={$inputSearch}
        bind:postalCode={$postalCode}
        onSubmit={(value, postalCode) => ctrl.onSubmit(value, postalCode)} />
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
            <div class="search-results-header fr-mb-2w">
                <p class="results-count fr-mb-0">
                    {nbResultLabel}
                </p>
                <div class="sort-control" aria-label="Tri des résultats">
                    <span class="sort-label">Trier par :</span>
                    <div class="sort-buttons">
                        <button
                            class="sort-button"
                            class:active={selectedSort === "relevance"}
                            type="button"
                            aria-pressed={selectedSort === "relevance"}
                            onclick={() => (selectedSort = "relevance")}>
                            Pertinence
                        </button>
                        <button
                            class="sort-button"
                            class:active={selectedSort === "alphabetical"}
                            type="button"
                            aria-pressed={selectedSort === "alphabetical"}
                            onclick={() => (selectedSort = "alphabetical")}>
                            Ordre alphabétique
                        </button>
                    </div>
                </div>
            </div>
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
            {#each $searchResults.results as simplifiedAsso (simplifiedAsso.siren + "-" + simplifiedAsso.rna)}
                <AssociationCard {simplifiedAsso} searchKey={$inputSearch} />
            {/each}
        </div>

        {#if $searchResults.nbPages > 1}
            <div class="fr-grid-row fr-mt-5w">
                <div class="fr-mx-auto">
                    <Pagination
                        totalPages={$searchResults.nbPages}
                        {currentPage}
                        onchange={e => ctrl.onChangePage(e)} />
                </div>
            </div>
        {/if}
    {/if}
{/await}

<style>
    .search-results-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .results-count {
        font-size: 16px;
        font-weight: 700;
    }

    .sort-control {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .sort-label {
        color: #161616;
        font-family: Marianne, Arial, sans-serif;
        font-size: 16px;
        font-weight: 400;
        white-space: nowrap;
    }

    .sort-buttons {
        display: inline-flex;
        align-items: center;
        height: 32px;
        box-sizing: border-box;
        border: 1px solid #dddddd;
        border-radius: 4px;
        background: var(--background-default-grey);
    }

    .sort-button {
        position: relative;
        height: 30px;
        box-sizing: border-box;
        padding: 0 12px;
        border: 0;
        border-radius: 0;
        background: var(--background-default-grey);
        color: #161616;
        font-family: Marianne, Arial, sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 1;
        white-space: nowrap;
        box-shadow: none;
    }

    .sort-button + .sort-button {
        border-left: 1px solid #dddddd;
    }

    .sort-button.active + .sort-button {
        border-left: 0;
    }

    .sort-button.active {
        position: relative;
        z-index: 1;
        height: 32px;
        margin-top: -1px;
        margin-bottom: -1px;
        border: 1px solid #000091;
        border-radius: 4px;
        color: #000091;
    }

    .sort-button.active:first-child {
        margin-left: -1px;
    }

    .sort-button.active:last-child {
        margin-right: -1px;
    }

    .search-layout {
        display: flex;
        flex-wrap: wrap;
    }

    @media (max-width: 48em) {
        .search-results-header {
            align-items: flex-start;
            flex-direction: column;
        }
    }
</style>

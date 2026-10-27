<script lang="ts">
    import DuplicateAlert from "../../association/[identifier]/components/DuplicateAlert.svelte";
    import SearchController from "./Search.controller";
    import Spinner from "$lib/components/Spinner.svelte";
    import AssociationItem from "$lib/components/AssociationItem/AssociationItem.svelte";
    import AdvancedSearchBar from "$lib/components/AdvancedSearchBar/AdvancedSearchBar.svelte";
    import Pagination from "$lib/dsfr/Pagination.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import { page } from "$lib/store/kit.store";
    import type { PageProps } from "./$types";

    let { params }: PageProps = $props();
    const name = $derived(params.name);
    const initialPostalCode = $derived($page.url.searchParams.get("postalCode") ?? undefined);
    const initialSort = $derived($page.url.searchParams.get("sort") === "alphabetical" ? "alphabetical" : "relevance");
    const initialNameOnly = $derived($page.url.searchParams.get("nameOnly") === "true");

    const ctrl = $derived(new SearchController(name, initialPostalCode, initialSort, initialNameOnly));
    const searchPromise = $derived(ctrl.searchPromise);
    const searchResults = $derived(ctrl.searchResults);
    const inputSearch = $derived(ctrl.inputSearch);
    const duplicatesFromIdentifier = $derived(ctrl.duplicatesFromIdentifier);
    const currentPage = $derived(ctrl.currentPage);
    const isLastSearchCompany = $derived(ctrl.isLastSearchCompany);
    const postalCode = $derived(ctrl.postalCode);
    const selectedSort = $derived(ctrl.selectedSort);
    const nameOnly = $derived(ctrl.nameOnly);
    const nbResultLabel = $derived.by(() => {
        void $searchResults;
        return ctrl.updateNbEtabsLabel();
    });
</script>

<div class="fr-my-6v">
    <AdvancedSearchBar
        bind:value={$inputSearch}
        bind:postalCode={$postalCode}
        bind:nameOnly={$nameOnly}
        onSubmit={(value, postalCode, nameOnly) => ctrl.onSubmit(value, postalCode, nameOnly)} />
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
            <div class="header fr-mb-2w">
                <p class="fr-text--bold fr-mb-0">
                    {nbResultLabel}
                </p>
                <div class="sort" aria-label="Tri des résultats">
                    <span>Trier par :</span>
                    <div class="buttons">
                        <button
                            class:active={$selectedSort === "relevance"}
                            type="button"
                            aria-pressed={$selectedSort === "relevance"}
                            onclick={() => ctrl.selectSort("relevance")}>
                            Pertinence
                        </button>
                        <button
                            class:active={$selectedSort === "alphabetical"}
                            type="button"
                            aria-pressed={$selectedSort === "alphabetical"}
                            onclick={() => ctrl.selectSort("alphabetical")}>
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

        <div class="fr-grid-row fr-grid-row--gutters">
            {#each $searchResults.results as simplifiedAsso (simplifiedAsso.siren + "-" + simplifiedAsso.rna)}
                <AssociationItem {simplifiedAsso} searchKey={$inputSearch} />
            {/each}
        </div>

        {#if $searchResults.nbPages > 1}
            <div class="fr-grid-row fr-mt-5w">
                <div class="fr-mx-auto">
                    <Pagination totalPages={$searchResults.nbPages} {currentPage} onchange={e => ctrl.selectPage(e)} />
                </div>
            </div>
        {/if}
    {/if}
{/await}

<style>
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .header > .sort {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .header > .sort > span {
        white-space: nowrap;
    }

    .buttons > button {
        position: relative;
        padding: 0.25rem 0.75rem;
        border-radius: 0.25rem;
    }

    .buttons > button.active {
        color: var(--text-active-blue-france);
        box-shadow: inset 0 0 0 1px var(--border-active-blue-france);
    }

    @media (max-width: 48em) {
        .header {
            align-items: flex-start;
            flex-direction: column;
        }

        .header > .sort {
            align-items: flex-start;
            flex-direction: column;
        }
    }
</style>

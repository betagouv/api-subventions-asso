<script lang="ts">
    import { HomeController } from "./Home.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import AssociationTag from "$lib/components/AssociationTag/AssociationTag.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";

    let { data } = $props();

    const query = $derived(data.query);
    const ctrl = $derived(new HomeController(query));
    const searchHistory = $derived(ctrl.searchHistory);
    const recentSearches = $derived([...$searchHistory].reverse());
</script>

{#if ctrl.successMessage}
    <Alert type="success" title={ctrl.successMessage.title}>
        {ctrl.successMessage.content}
    </Alert>
{/if}

<div class="fr-grid-row fr-grid-row--center fr-mt-6v">
    <div class="fr-col-7">
        <h1 class="fr-h4 text-center">
            Consulter les dernières informations sur les associations et leurs subventions
        </h1>
    </div>
</div>
<div class="fr-grid-row fr-grid-row--center fr-mt-6v">
    <div class="fr-col-8">
        <div class="search-bar">
            <SearchBar onsubmit={value => ctrl.onSubmit(value)} />
            <p class="fr-mt-3w text-center fr-text--lg">
                Pour effectuer une recherche, privilégiez une entrée par RNA, SIREN ou SIRET. Vous pouvez également
                rechercher une association par nom.
            </p>
        </div>
    </div>
</div>

{#if $searchHistory.length}
    <div class="fr-grid-row fr-grid-row--center fr-mt-12v fr-mb-6v">
        <h2 class="fr-h4">Consultations récentes</h2>
    </div>
    <div class="association-tags">
        {#each recentSearches as search, index (search.rna || search.siren)}
            <AssociationTag simplifiedAsso={search} />
            {#if index === 2 && recentSearches.length > 3}
                <span class="association-tags-break" aria-hidden="true"></span>
            {/if}
        {/each}
    </div>
{/if}

<style>
    .association-tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        column-gap: 8px;
        row-gap: 0;
        margin-bottom: 3rem;
    }

    .association-tags-break {
        flex-basis: 100%;
        height: 0;
    }

    .association-tags-break ~ :global(.association-tag) {
        margin-top: 8px;
    }

    @media (max-width: 62em) {
        .association-tags {
            flex-direction: column;
            flex-wrap: nowrap;
            row-gap: 8px;
        }

        .association-tags-break {
            display: none;
        }

        .association-tags-break ~ :global(.association-tag) {
            margin-top: 0;
        }
    }
</style>

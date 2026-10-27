<script lang="ts">
    import { HomeController } from "./Home.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import AssociationTag from "$lib/components/AssociationTag/AssociationTag.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";

    let { data } = $props();

    const ctrl = new HomeController(data.query);
    const searchHistory = ctrl.searchHistory;
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
            <SearchBar disableIfEmpty={false} onSubmit={value => ctrl.onSubmit(value)} />
            <p class="fr-mt-3w fr-mb-0 text-center">
                <a class="fr-link fr-icon-arrow-right-line fr-link--icon-right" href="/advanced-search">
                    Filtrer par localisation
                </a>
            </p>
            <p class="help fr-text--sm fr-mt-3w text-center">
                Pour un identifiant RNA : lettre W + 1 chiffre + 1 lettre ou chiffre + 7 chiffres; SIREN : 9 chiffres;
                SIRET : 14 chiffres.
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
                <span aria-hidden="true"></span>
            {/if}
        {/each}
    </div>
{/if}

<style>
    .search-bar > .help {
        color: var(--text-mention-grey);
    }

    .association-tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        margin-bottom: 3rem;
    }

    .association-tags > span {
        flex-basis: 100%;
    }

    .association-tags > span ~ :global(a) {
        margin-top: 0.5rem;
    }

    @media (max-width: 62em) {
        .association-tags {
            flex-direction: column;
            flex-wrap: nowrap;
            row-gap: 0.5rem;
        }

        .association-tags > span {
            display: none;
        }

        .association-tags > span ~ :global(a) {
            margin-top: 0;
        }
    }
</style>

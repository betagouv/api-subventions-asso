<script lang="ts">
    import { HomeController } from "./Home.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import AssociationCard from "$lib/components/AssociationCard/AssociationCard.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";

    let { data } = $props();

    const query = $derived(data.query);
    const ctrl = $derived(new HomeController(query));
    const searchHistory = $derived(ctrl.searchHistory);
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
            <SearchBar compactHeight={true} disableIfEmpty={false} onSubmit={value => ctrl.onSubmit(value)} />
            <p class="fr-mt-3w fr-mb-0 text-center">
                <a
                    class="advanced-search-link fr-link fr-icon-arrow-right-line fr-link--icon-right"
                    href="/advanced-search">
                    Recherche avancée
                </a>
            </p>
            <p class="search-help fr-mt-3w text-center">
                Identifiant RNA : lettre W + 1 chiffre + 1 caractère alphanumérique + 7 chiffres • SIREN : 9 chiffres •
                SIRET : 14 chiffres
            </p>
        </div>
    </div>
</div>

{#if $searchHistory.length}
    <div class="fr-grid-row fr-grid-row--center fr-mt-12v fr-mb-6v">
        <h2 class="fr-h4">Vos dernières recherches</h2>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
        {#each $searchHistory.reverse() as search, index (index)}
            <AssociationCard simplifiedAsso={search} />
        {/each}
    </div>
{/if}

<style>
    .advanced-search-link {
        font-family: Marianne, Arial, sans-serif;
        font-size: 16px;
        font-weight: 400;
    }

    .search-help {
        color: #666666;
        font-family: Marianne, Arial, sans-serif;
        font-size: 14px;
        font-weight: 400;
    }
</style>

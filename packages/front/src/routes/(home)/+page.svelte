<script lang="ts">
    import { HomeController } from "./Home.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import AssociationCard from "$lib/components/AssociationCard/AssociationCard.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";

    export let data;
    const { query } = data;

    const ctrl = new HomeController(query);
    const { searchHistory } = ctrl;
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
            <p class="fr-mt-3w text-center fr-text--lg">
                Pour effectuer une recherche, privilégiez une entrée par RNA, SIREN ou SIRET. Vous pouvez également
                rechercher une association par nom.
            </p>
            <SearchBar on:submit={e => ctrl.onSubmit(e.detail)} />
        </div>
    </div>
</div>

{#if $searchHistory.length}
    <div class="fr-grid-row fr-grid-row--center fr-mt-12v fr-mb-6v">
        <h2 class="fr-h4">Vos dernières recherches</h2>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
        {#each $searchHistory.reverse() as search}
            <AssociationCard simplifiedAsso={search} />
        {/each}
    </div>
{/if}

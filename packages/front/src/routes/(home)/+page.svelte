<script>
    import ResultCard from "./components/ResultCard.svelte";
    import { HomeController } from "./Home.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import AssociationCard from "$lib/components/AssociationCard/AssociationCard.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import Messages from "$lib/components/Messages/Messages.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";

    export let data;
    const { query } = data;

    const ctrl = new HomeController(query);
    const { input, isLoading, currentSearch, searchResult, searchHistory } = ctrl;

    $: input && ctrl.onInput($input);
</script>

<Messages />

{#if ctrl.successMessage}
    <Alert type="success" title={ctrl.successMessage.title}>
        {ctrl.successMessage.content}
    </Alert>
{/if}

<h1 class="fr-h4 fr-px-14v fr-py-6v fr-mb-6v">
    Consulter les dernières informations sur les associations et leurs subventions
</h1>

<div class="search-bar">
    <SearchBar bind:value={$input} on:submit={() => ctrl.onSubmit()} />
</div>

{#if $isLoading}
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-12">
            <div class="fr-card fr-card--no-arrow">
                <div class="fr-card__body">
                    <Spinner description="Recherche en cours" />
                </div>
            </div>
        </div>
    </div>
{:else if $currentSearch}
    {#await $currentSearch.promise then _result}
        {#if $searchResult.length}
            <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters search-result">
                {#each $searchResult as association}
                    <ResultCard {association} searchValue={$input} />
                {/each}
            </div>
        {:else}
            <div class="fr-mt-2w" />
            <Alert type="info" small={true}>
                <p>
                    Si la recherche par nom ne donne pas de résultats, vous pouvez essayer avec le RNA, SIREN ou SIRET
                </p>
            </Alert>
            <Alert small={true}>
                <p>Nous n'avons trouvé aucun résultat pour votre recherche</p>
            </Alert>
        {/if}
    {:catch _error}
        <div class="fr-mt-2w" />
        <Alert type="error" small={true}>
            <p>Une erreur est survenue</p>
        </Alert>
    {/await}
{/if}

{#if !$isLoading && !$searchResult.length && $searchHistory.length}
    <div class="history fr-pt-5w">
        <h2 class="fr-h4 fr-py-3w">Vos dernières recherches</h2>
        <div class="fr-grid-row fr-grid-row--gutters">
            {#each $searchHistory.reverse() as search}
                <AssociationCard title={search.name} simplifiedAsso={search} />
            {/each}
        </div>
    </div>
{/if}

<style>
    h1 {
        text-align: center;
    }

    h1,
    .search-bar {
        margin: auto;
        justify-content: space-around;
        max-width: 792px;
    }

    .search-result {
        max-height: 50vh;
        overflow: auto;
    }
</style>

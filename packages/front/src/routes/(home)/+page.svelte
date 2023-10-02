<script>
    import ResultCard from "./components/ResultCard.svelte";
    import { HomeController } from "./Home.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Card from "$lib/dsfr/Card.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import Messages from "$lib/components/Messages/Messages.svelte";

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

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <form on:submit|preventDefault={() => ctrl.onSubmit()}>
            <div class="fr-search-bar fr-search-bar--lg" id="search-input">
                <input
                    class="fr-input"
                    placeholder="Recherche une association par nom ou par identifiant RNA, SIREN ou SIRET…"
                    type="search"
                    id="search-input-input"
                    name="search-input"
                    bind:value={$input} />
                <button class="fr-btn" title="Rechercher" id="search-input-button" type="submit">Rechercher</button>
            </div>
        </form>
    </div>
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
        <h4 class="fr-py-3w">Vos dernières recherches</h4>
        <div class="fr-grid-row fr-grid-row--gutters">
            {#each $searchHistory.reverse() as search}
                <Card
                    url={"/association/" + (search.rna || search.siren)}
                    title={search.name}
                    size="6"
                    direction="horizontal">
                    <div class="card-description">
                        {search.objectSocial}
                    </div>
                </Card>
            {/each}
        </div>
    </div>
{/if}

<style>
    .search-result {
        max-height: 50vh;
        overflow: auto;
    }

    .card-description {
        min-height: 3rem;
    }

    .history .card-description {
        display: -webkit-box;
        overflow: hidden;
        overflow-wrap: anywhere;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
</style>

<script>
    import { onMount } from "svelte";
    import homeService from "./home.service";

    import debounceFactory from "../../helpers/timeHelper";
    import { getSearchHistory } from "../../services/storage.service";
    import { truncate } from "../../helpers/textHelper";

    import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
    import Alert from "../../dsfr/Alert.svelte";
    import Card from "../../dsfr/Card.svelte";

    import Spinner from "../../components/Spinner.svelte";
    import ResultCard from "./composents/ResultCard.svelte";
    import InteruptSearchError from "./error/InteruptSearchError";

    export let searchParams;

    const segments = [];

    let error = searchParams.get("error");
    let isLoading = false;
    let searchResult = [];
    let searchHistory = [];
    let input = "";

    const searchAssociation = async text => {
        error = false;
        searchResult.length = 0;

        if (text.length < 3) return;

        try {
            isLoading = true;
            const result = await homeService.search(text);
            searchResult = result;
        } catch (e) {
            if (e instanceof InteruptSearchError) return;

            error = true;
        }
        isLoading = false;
    };

    const submitHandler = () => {
        if (searchResult.length === 0) return;
        location.href = `/association/${searchResult[0].rna || searchResult[0].siren}`;
    };

    const debounce = debounceFactory(200);

    onMount(() => searchHistory = getSearchHistory())

    $: input, debounce(() => searchAssociation(input));
</script>

<Breadcrumb {segments} />
<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <form on:submit|preventDefault={submitHandler}>
            <div class="fr-search-bar fr-search-bar--lg" id="search-input">
                <input
                    class="fr-input"
                    placeholder="Recherche une association par nom ou par identifiant RNA, SIREN ou SIRET…"
                    type="search"
                    id="search-input-input"
                    name="search-input"
                    bind:value={input} />
                <button class="fr-btn" title="Rechercher" id="search-input-button" type="submit">Rechercher</button>
            </div>
        </form>
    </div>
</div>

{#if isLoading}
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-12">
            <div class="fr-card fr-card--no-arrow">
                <div class="fr-card__body">
                    <Spinner description="Recherche en cours" />
                </div>
            </div>
        </div>
    </div>


{:else if error}
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-12">
            <div class="fr-card fr-card--no-arrow">
                <div class="fr-card__body">
                    <Alert small={true}>
                        <p>Nous n'avons trouvé aucun résultat pour votre recherche</p>
                    </Alert>
                </div>
            </div>
        </div>
    </div>

{:else if searchResult }
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters search-result">
        {#each searchResult as association}
        <ResultCard {association} searchValue={input} />
        {/each}
    </div>
{/if}

{#if !searchResult.length && !isLoading && searchHistory.length }
<div class="history">
    <h4>Vos dernières recherches</h4>
    <div class="fr-grid-row fr-grid-row--gutters">
        {#each searchHistory as search }
            <Card url={'/association/' + (search.rna || search.siren) } title={search.name} size="6" direction="horizontal">
                <div class="card-description">
                    {truncate(search.objectSocial, 150)}
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

    .history {
        padding-top: 40px;
    }

    .history > h4 {
        padding-top: 24px;
        padding-bottom: 24px;
    }
</style>

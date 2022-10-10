<script>
    import homeService from "./home.service";

    import debounceFactory from "../../helpers/timeHelper";

    import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
    import Alert from "../../dsfr/Alert.svelte";

    import Spinner from "../../components/Spinner.svelte";
    import ResultCard from "./composents/ResultCard.svelte";

    export let searchParams;

    const segments = [];

    let error = searchParams.get("error");
    let loadingSearch = false;
    let searchResult = [];
    let input = "";

    const searchAssociation = async text => {
        error = false;
        searchResult.length = 0;

        if (text.length < 2) return;

        try {
            loadingSearch = true;
            const result = await homeService.search(text);
            searchResult = result;
        } catch {
            error = true;
        }
        loadingSearch = false;
    };

    const submitHandler = () => {
        if (searchResult.length === 0) return;
        location.href = `/association/${searchResult[0].rna || searchResult[0].siren}`;
    };

    const debounce = debounceFactory(200);

    $: input, debounce(() => searchAssociation(input));
</script>

<Breadcrumb {segments} />
<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <form on:submit|preventDefault={submitHandler}>
            <fieldset class="fr-fieldset fr-my-4w">
                <div class="fr-search-bar fr-search-bar--lg" id="search-input">
                    <input
                        class="fr-input"
                        placeholder="Rechercher un nom d’association, un SIREN, un SIRET, un RNA, un NOM…"
                        type="search"
                        id="search-input-input"
                        name="search-input"
                        bind:value={input} />
                    <button class="fr-btn" title="Rechercher" id="search-input-button" type="submit">Rechercher</button>
                </div>
            </fieldset>
        </form>
    </div>
</div>

{#if loadingSearch}
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-12">
            <div class="fr-card fr-card--no-arrow">
                <div class="fr-card__body">
                    <Spinner description="Recherche en cours" />
                </div>
            </div>
        </div>
    </div>
{/if}

{#if error}
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
{/if}

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters search-result">
    {#each searchResult as association}
        <ResultCard {association} searchValue={input} />
    {/each}
</div>

<style>
    .search-result {
        max-height: 50vh;
        overflow: auto;
    }
</style>

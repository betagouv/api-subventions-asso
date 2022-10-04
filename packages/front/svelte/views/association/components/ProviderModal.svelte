<script>
    import Spinner from "../../../components/Spinner.svelte";
    import DataNotFound from "../../../components/DataNotFound.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte";

    import associationService from "../association.service";

    let promise = associationService.getProviders();
</script>

<div class="fr-modal__content">
    <h1 id="fr-modal-title" class="fr-modal__title">
        <span class="fr-fi-arrow-right-line fr-fi--lg" aria-hidden="true" />
        Liste des fournisseurs de données
    </h1>
    {#await promise}
        <Spinner />
    {:then providers}
        {#each [...providers.raw, ...providers.api] as provider}
            <div>
                <h5>{provider.name}</h5>
                <p>{provider.description}</p>
            </div>
        {/each}
    {:catch error}
        {#if error.request && error.request.status == 404}
            <DataNotFound />
        {:else}
            <ErrorAlert message={error.message} />
        {/if}
    {/await}
</div>

<style>
    h1 {
        display: flex;
        gap: 12px;
    }
</style>

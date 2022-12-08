<script>
    import Spinner from "../../../Spinner.svelte";
    import DataNotFound from "../../../DataNotFound.svelte";
    import ErrorAlert from "../../../ErrorAlert.svelte";
    import ProviderModalController from "./ProviderModal.controller";

    const controller = new ProviderModalController();
    const { loading, providers, error } = controller;
</script>

<div class="fr-modal__content">
    <h1 id="fr-modal-title" class="fr-modal__title">
        <span class="fr-fi-arrow-right-line fr-fi--lg" aria-hidden="true" />
        Liste des fournisseurs de données
    </h1>
    {#if $loading}
        <Spinner />
    {:else if $error}
        {#if $error.request && $error.request.status == 404}
            <DataNotFound />
        {:else}
            <ErrorAlert message={$error.message} />
        {/if}
    {:else}
        {#each [...$providers.raw, ...$providers.api] as provider}
            <div>
                <h5>{provider.name}</h5>
                <p>{provider.description}</p>
            </div>
        {/each}
    {/if}
</div>

<style>
    h1 {
        display: flex;
        gap: 12px;
    }
</style>

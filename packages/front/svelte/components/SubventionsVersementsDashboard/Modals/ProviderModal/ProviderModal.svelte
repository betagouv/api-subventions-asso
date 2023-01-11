<script>
    import Spinner from "../../../Spinner.svelte";
    import DataNotFound from "../../../DataNotFound.svelte";
    import ErrorAlert from "../../../ErrorAlert.svelte";
    import ProviderModalController from "./ProviderModal.controller";
    import ModalContent from "../../../../dsfr/ModalContent.svelte";

    const controller = new ProviderModalController();
    const { loading, providers, error } = controller;
</script>

<ModalContent title="Liste des fournisseurs de données">
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
</ModalContent>

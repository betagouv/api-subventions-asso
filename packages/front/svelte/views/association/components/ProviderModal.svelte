<script>
    import Modal from "../../../dsfr/Modal.svelte";
    import Spinner from "../../../components/Spinner.svelte";
    import DataNotFound from "../../../components/DataNotFound.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte";

    import associationService from "../association.service";

    export let id;

    let promise = associationService.getProviders();
</script>

<Modal title="Liste des fournisseurs de données" modalId={id}>
    <svelte:fragment slot="content">
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
    </svelte:fragment>
</Modal>

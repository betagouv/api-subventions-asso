<script>
    import { onMount } from "svelte";

    import Spinner from "$lib/components/Spinner.svelte";
    import ErrorAlert from "$lib/components/ErrorAlert.svelte";
    import DataNotFound from "$lib/components/DataNotFound.svelte";
    import EstablishmentCard from "./EstablishmentCard.svelte";
    import associationService from "$lib/resources/associations/association.service";

    import { waitElementIsVisible } from "@helpers/visibilityHelper";

    export let associationIdentifier;
    export let association;

    let element;
    let promise = new Promise(() => null);

    onMount(async () => {
        await waitElementIsVisible(element);
        promise = associationService.getEstablishments(associationIdentifier);
    });
</script>

<div bind:this={element}>
    {#await promise}
        <Spinner description="Chargement des établissements en cours ..." />
    {:then etablissements}
        {#if etablissements.length}
            <h3>Les établissements rattachés à cette association</h3>
            <div class="fr-grid-row fr-grid-row--gutters">
                {#each etablissements as etablissement}
                    <EstablishmentCard
                        name={association.denomination_rna || association.denomination_siren}
                        establishment={etablissement} />
                {/each}
            </div>
        {:else}
            <DataNotFound
                content="Nous sommes désolés, nous n'avons trouvé aucun établissement lié à cette association" />
        {/if}
    {:catch error}
        {#if error.request && error.request.status == 404}
            <DataNotFound
                content="Nous sommes désolés, nous n'avons trouvé aucun établissement lié à cette association" />
        {:else}
            <ErrorAlert message={error.message} />
        {/if}
    {/await}
</div>

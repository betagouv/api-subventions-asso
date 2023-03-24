<script>
    import { onMount } from "svelte";
    import associationService from "../association.service.js";

    import Spinner from "../../../components/Spinner.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte";
    import DataNotFound from "../../../components/DataNotFound.svelte";

    import { waitElementIsVisible } from "@helpers/visibilityHelper";
    import EstablishmentCard from "@components/EstablishmentCard/EstablishmentCard.svelte";

    export let associationIdentifier;
    export let association;

    let element;
    let promise = new Promise(() => null);

    onMount(async () => {
        await waitElementIsVisible(element);
        promise = associationService.getEtablissements(associationIdentifier);
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
                        assoName={association.denomination_rna || association.denomination_siren}
                        establishment={etablissement} />
                {/each}
            </div>
        {:else}
            <DataNotFound
                content="Nous sommes désolés, nous n'avons trouvé aucun etablissement liée à cette association" />
        {/if}
    {:catch error}
        {#if error.request && error.request.status == 404}
            <DataNotFound
                content="Nous sommes désolés, nous n'avons trouvé aucun etablissement liée à cette association" />
        {:else}
            <ErrorAlert message={error.message} />
        {/if}
    {/await}
</div>

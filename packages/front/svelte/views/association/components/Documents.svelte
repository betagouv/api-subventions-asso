<script>
    import { onMount } from "svelte";
    import associationService from "../association.service.js";
    import { waitElementIsVisible } from "../../../helpers/visibilityHelper";

    import Spinner from "../../../components/Spinner.svelte";
    import CardDocuments from "../../../components/CardDocuments.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte"

    export let associationIdentifier;

    let element;
    let promise = new Promise(() => null);

    onMount(async () => {
        await waitElementIsVisible(element);
        promise = associationService.getDocuments(associationIdentifier);
    })
</script>

<div bind:this={element}>
    {#await promise}
        <Spinner description="Chargement des pièces administratives en cours ..."/>
    {:then Documents}
        <h3>Pièces administratives pour cette association</h3>
        <div class="fr-grid-row fr-grid-row--gutters">
            {#each Documents as document }
                <CardDocuments 
                    title={document.label}
                    url="{document.url}" 
                    size="6"
                    footer="Déposer le {document.date.toLocaleDateString()}"
                >
                    {document.nom}
                </CardDocuments>
            {/each}
        </div>
    {:catch error}
        <ErrorAlert message={error.message}></ErrorAlert>
    {/await}
</div>

<style>
</style>

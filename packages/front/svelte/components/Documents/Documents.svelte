<script>
    import { onMount } from "svelte";

    import Spinner from "../Spinner.svelte";
    import ErrorAlert from "../ErrorAlert.svelte";
    import DataNotFound from "../DataNotFound.svelte";
    import Alert from "../../dsfr/Alert.svelte";
    import { DocumentsController } from "./Documents.controller";
    import Card from "@dsfr/Card.svelte";

    export let resource;
    export let resourceType = "association";

    const controller = new DocumentsController(resourceType, resource);
    const documentsPromise = controller.documentsPromise;

    onMount(() => controller.onMount());
</script>

<div bind:this={controller.element}>
    {#await $documentsPromise}
        <Spinner description="Chargement des pièces administratives en cours ..." />
    {:then documents}
        {#if documents.length}
            <Alert type="info" title="État des fichiers">
                Certains fichiers peuvent être erronés selon la manière dont ils ont été renseignés auprès de nos
                fournisseurs de données.
            </Alert>
            <h3>Pièces administratives pour {controller.resourceNameWithDemonstrative}</h3>
            <div class="fr-grid-row fr-grid-row--gutters">
                {#each documents as document}
                    <Card
                        title={document.label}
                        url={document.url}
                        size="6"
                        endDetail={controller.getDateString(document.date)}
                        target="_blank">
                        <p>
                            {document.nom}
                        </p>

                        <p class="card-document_fournisseur">
                            Fournisseur du fichier: <b>{document.provider}</b>
                        </p>
                    </Card>
                {/each}
            </div>
        {:else}
            <DataNotFound
                content="Nous sommes désolés, nous n'avons trouvé aucun document sur {controller.resourceNameWithDemonstrative}" />
        {/if}
    {:catch error}
        {#if error.request && error.request.status === 404}
            <DataNotFound
                content="Nous sommes désolés, nous n'avons trouvé aucun document sur {controller.resourceNameWithDemonstrative}" />
        {:else}
            <ErrorAlert message={error.message} />
        {/if}
    {/await}
</div>

<style>
    .card-document_fournisseur {
        font-size: 0.9em;
    }
</style>

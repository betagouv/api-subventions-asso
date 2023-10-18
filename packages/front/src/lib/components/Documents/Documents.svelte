<script>
    import { onMount } from "svelte";

    import Spinner from "../Spinner.svelte";
    import ErrorAlert from "../ErrorAlert.svelte";
    import DataNotFound from "../DataNotFound.svelte";
    import { DocumentsController } from "./Documents.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Card from "$lib/dsfr/Card.svelte";
    import documentService from "$lib/resources/documents/documents.service";

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
                        onClick={e => controller.onClick(e, document)}
                        target="_blank">
                        <p>
                            {document.nom}
                        </p>

                        <p class="fr-text--sm">
                            Fournisseur du fichier: <b>{document.provider}</b>
                        </p>

                        {#if documentService.isInternalLink(document.url)}
                            <p class="fr-text--sm" style="font-style: italic">
                                <span class="fr-icon-question-line fr-icon--sm" aria-hidden="true" />
                                Faire un clic gauche pour télécharger la pièce
                            </p>
                        {/if}

                        <div slot="card-end">
                            <p class="fr-card__detail">{controller.getDateString(document.date)}</p>
                        </div>
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

<script lang="ts">
    import { onMount } from "svelte";

    import Spinner from "../Spinner.svelte";
    import ErrorAlert from "../ErrorAlert.svelte";
    import DataNotFound from "../DataNotFound.svelte";
    import { DocumentsController } from "./Documents.controller";
    import DocumentCard from "./components/DocumentCard.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import type { ResourceType } from "$lib/types/ResourceType";
    import type AssociationEntity from "$lib/resources/associations/entities/AssociationEntity";
    import Button from "$lib/dsfr/Button.svelte";

    // TODO: replace unknown with EstablishmentEntity when created
    export let resource: AssociationEntity | unknown;
    export let resourceType: ResourceType = "association";

    const controller = new DocumentsController(resourceType, resource);
    const documentsPromise = controller.documentsPromise;
    const zipPromise = controller.zipPromise;

    onMount(() => {
        controller.onMount();
    });
</script>

<div bind:this={controller.element}>
    <h2 class="fr-sr-only">Pièces administratives pour {controller.resourceNameWithDemonstrative}</h2>
    {#await $documentsPromise}
        <Spinner description="Chargement des pièces administratives en cours ..." />
    {:then documents}
        {#if documents?.some}
            <Alert type="info" title="État des fichiers">
                Certains fichiers peuvent être erronés selon la manière dont ils ont été renseignés auprès de nos
                fournisseurs de données.
            </Alert>

            {#await $zipPromise}
                <Alert type="info" title="Le téléchargement des fichiers va démarrer d’ici à 8 secondes." />
            {/await}

            <div class="fr-grid-row fr-mb-4w fr-mt-6w">
                <div class="fr-ml-auto">
                    <Button
                        iconPosition="right"
                        icon="download-line"
                        trackerName="download-zip"
                        title="Tout télécharger"
                        on:click={() => controller.downloadAll()}>
                        Tout télécharger
                    </Button>
                </div>
            </div>

            <!-- Asso documents -->
            {#if documents.assoDocs.length}
                <h3 class="fr-h2 fr-mt-3w fr-mb-6w">Pièces provenant de l’INSEE et du RNA</h3>
                <!-- change top margin when we have download all button -->
                <div class="fr-grid-row">
                    {#each documents.assoDocs as document}
                        <DocumentCard {document} />
                    {/each}
                </div>
            {/if}

            {#if documents.estabDocs.length}
                <!-- Etab documents -->
                <h3 class="fr-h2 fr-mt-3w fr-mb-6w">
                    {controller.estabDocsTitle}
                </h3>
                <div class="fr-grid-row">
                    {#each documents.estabDocs as document}
                        <DocumentCard {document} />
                    {/each}
                </div>
            {/if}
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

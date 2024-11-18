<script lang="ts">
    import { onMount } from "svelte";

    import Spinner from "../Spinner.svelte";
    import ErrorAlert from "../ErrorAlert.svelte";
    import DataNotFound from "../DataNotFound.svelte";
    import { DocumentsController } from "./Documents.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import type { ResourceType } from "$lib/types/ResourceType";
    import type AssociationEntity from "$lib/resources/associations/entities/AssociationEntity";
    import { currentIdentifiers } from "$lib/store/association.store";
    import DownloadButton from "$lib/components/Documents/components/DownloadButton.svelte";
    import DocumentSection from "$lib/components/Documents/components/DocumentSection.svelte";

    // TODO: replace unknown with EstablishmentEntity when created
    export let resource: AssociationEntity | unknown;
    export let resourceType: ResourceType = "association";

    const controller = new DocumentsController(resourceType, resource, $currentIdentifiers);
    const documentsPromise = controller.documentsPromise;
    const zipPromise = controller.zipPromise;
    const { selectedDocsOrNull } = controller;

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

            <div class="fr-grid-row fr-mb-1w fr-mt-6w">
                <div class="fr-ml-auto">
                    <DownloadButton
                        docsStore={controller.flatSelectedDocs}
                        on:download={() => controller.download()}
                        on:reset={() => controller.resetSelection()} />
                </div>
            </div>

            <div class="fr-sr-only">
                Ci-dessous une liste de documents liés à {controller.resourceNameWithDemonstrative}. Chaque document est
                associée à une checbkox qui sélectionne le document pour un téléchargement groupé sous forme de zip, et,
                si le document n'est pas sélectionné, d'un lien de téléchargement pour le document seul.
            </div>

            <DocumentSection
                documents={documents.assoDocs}
                title="Pièces provenant de l’INSEE et du RNA"
                bind:selectedDocs={$selectedDocsOrNull.assoDocs} />

            <div class="fr-mt-6w" />

            <DocumentSection
                documents={documents.estabDocs}
                title="Pièces complémentaires déposées par l’établissement secondaire"
                bind:selectedDocs={$selectedDocsOrNull.estabDocs} />

            <div class="fr-mt-6w" />

            <DocumentSection
                documents={documents.headDocs}
                title="Pièces complémentaires déposées par l’établissement siège"
                bind:selectedDocs={$selectedDocsOrNull.headDocs} />

            <div class="fr-grid-row fr-mb-1w fr-mt-6w">
                <div class="fr-ml-auto">
                    <DownloadButton
                        docsStore={controller.flatSelectedDocs}
                        on:download={() => controller.download()}
                        on:reset={() => controller.resetSelection()} />
                </div>
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

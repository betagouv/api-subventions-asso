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
    const { selectedDocsOrNull, downloadBtnLabel } = controller;

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
                    <ul
                        class="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-sm fr-btns-group--icon-right fr-btns-group--right">
                        <li>
                            <Button
                                iconPosition="right"
                                icon="download-line"
                                trackerName="download-zip"
                                title={$downloadBtnLabel}
                                on:click={() => controller.download()}>
                                {$downloadBtnLabel}
                            </Button>
                        </li>
                        <li>
                            <Button
                                type="tertiary"
                                outline={false}
                                trackerName="reset-docs-selection"
                                on:click={() => controller.resetSelection()}>
                                Réinitialiser
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="fr-sr-only">
                Ci-dessous une liste de documents liés à {controller.resourceNameWithDemonstrative}. Chaque document est
                associée à une checbkox qui sélectionne le document pour un téléchargement groupé sous forme de zip, et,
                si le document n'est pas sélectionné, d'un lien de téléchargement pour le document seul.
            </div>

            <!-- Asso documents -->
            {#if documents.assoDocs.length}
                <h3 class="fr-h2 fr-mb-4w">Pièces provenant de l’INSEE et du RNA</h3>
                <section class="fr-ml-n2w">
                    {#each documents.assoDocs as document, i}
                        <DocumentCard {document} bind:value={$selectedDocsOrNull.assoDocs[i]} />
                    {/each}
                </section>
            {/if}

            {#if documents.estabDocs.length}
                <!-- Etab documents -->
                <h3 class="fr-h2 fr-mt-6w fr-mb-4w">
                    {controller.estabDocsTitle}
                </h3>
                <section class="fr-ml-n2w">
                    {#each documents.estabDocs as document, i}
                        <DocumentCard {document} bind:value={$selectedDocsOrNull.estabDocs[i]} />
                    {/each}
                </section>
            {/if}
            <ul class="fr-sr-only">
                <li>
                    <Button trackerName="download-zip" title={$downloadBtnLabel} on:click={() => controller.download()}>
                        {$downloadBtnLabel}
                    </Button>
                </li>
                <li>
                    <Button trackerName="reset-docs-selection" on:click={() => controller.resetSelection()}>
                        Réinitialiser
                    </Button>
                </li>
            </ul>
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

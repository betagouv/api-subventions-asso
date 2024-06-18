<script lang="ts">
    import { DocumentCardController } from "./DocumentCard.controller";
    import type { DocumentEntity } from "$lib/entities/DocumentEntity";

    export let document: DocumentEntity;
    export let value: DocumentEntity | undefined = undefined;

    const controller = new DocumentCardController(document);
    const { isSelected } = controller;
    $: $isSelected = value !== undefined;
</script>

<div class="card-container fr-grid-row fr-col-12" class:--selected={$isSelected}>
    <div class="fr-grid-row checkbox-wrapper">
        <div class="fr-checkbox-group document-selector">
            <input
                name="documents-to-download"
                id="documents-to-download-{controller.checkBoxId}"
                aria-describedby="description-document-{controller.checkBoxId}"
                type="checkbox"
                bind:checked={$isSelected}
                on:change={() => (value = controller.newValueOnCheck())} />
            <label class="fr-label fr-sr-only" for="documents-to-download-{controller.checkBoxId}">
                Sélectionner pour téléchargement groupé
            </label>
        </div>
        <div
            class="fr-card fr-card--no-icon fr-card--horizontal fr-card--no-border"
            id="description-document-{controller.checkBoxId}">
            <div class="fr-card__body">
                <div class="fr-card__content fr-p-2w">
                    <div>
                        <h4 class="fr-card__title fr-h5">{controller.documentLabel}</h4>
                        <p class="fr-card__desc fr-hint-text fr-mt-2v fr-mb-0">
                            {controller.getDateString(document.date)}
                            ― Fourni par :
                            <b>{document.provider}</b>
                            <!-- TODO  ― {document.format} - {document.size} -->
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex download-wrapper">
        <div class="fr-my-auto fr-mx-2w">
            <a
                class="fr-link"
                href={$isSelected ? undefined : document.url}
                aria-describedby="description-document-{controller.checkBoxId}"
                title="Télécharger"
                target="_blank"
                rel="noopener noreferrer">
                Télécharger
            </a>
        </div>
    </div>
</div>

<style>
    /* BEGIN - custom checkbox positioning */
    .checkbox-wrapper .fr-checkbox-group {
        position: initial;
    }

    .checkbox-wrapper .fr-checkbox-group input[type="checkbox"] + label {
        position: initial;
        margin-left: 0;
    }

    .checkbox-wrapper .fr-checkbox-group input[type="checkbox"] + label::before {
        position: absolute;
        left: 0;
        top: 1.2rem;
    }
    /* END - custom checkbox positioning */

    /* BEGIN - englobe card to select checkbox */
    .checkbox-wrapper {
        position: relative;
    }

    .document-selector input ~ label::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }
    /* END - englobe card to select checkbox */

    /* BEGIN - dynamic checkbox display */
    .document-selector {
        opacity: 0;
    }

    .card-container:hover .document-selector,
    .card-container:focus-within .document-selector,
    .card-container.--selected .document-selector {
        opacity: 1;
    }
    /* END - dynamic checkbox display */

    /* BEGIN - generic card style */
    .fr-card__title {
        color: var(--text-title-blue-france);
    }

    .fr-card__content {
        display: flex;
        flex-direction: row;
    }

    .fr-card,
    .download-wrapper {
        border-bottom: 1px var(--border-default-grey) solid;
    }

    .fr-card__desc {
        min-height: initial;
    }
    /* END - generic card style */

    /* BEGIN - dynamic card background */
    .checkbox-wrapper:hover .fr-card {
        background-color: var(--background-alt-grey);
    }

    .checkbox-wrapper:focus-within .fr-card {
        background-color: var(--background-alt-grey);
    }

    .card-container.--selected .fr-card {
        background-color: var(--background-contrast-blue-france);
    }
    /* END - dynamic card background */

    /* BEGIN - general layout */
    .checkbox-wrapper,
    .checkbox-wrapper .fr-card {
        flex-grow: 1;
    }

    .document-selector {
        flex: 0 0 2.25rem;
        max-width: 2.25rem;
        width: 2.25rem;
    }
    /* END - general layout */
</style>

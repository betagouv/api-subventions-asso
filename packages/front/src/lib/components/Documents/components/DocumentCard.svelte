<script>
    import { DocumentCardController } from "./DocumentCard.controller";

    export let document;
    export let isSelected = false;
    const controller = new DocumentCardController();
</script>

<div class="fr-col-12">
    <div class="fr-card fr-card--no-icon fr-card--horizontal fr-card--no-border" class:--active={isSelected}>
        <div class="fr-card__body">
            <div class="fr-card__content fr-p-2w">
                <div>
                    <h4 class="fr-card__title fr-h5">{document.label}</h4>
                    <p class="fr-card__desc fr-hint-text fr-mt-2v fr-mb-0">
                        {controller.getDateString(document.date)}
                        ― Fourni par :
                        <b>{document.provider}</b>
                        <!-- TODO  ― {document.format} - {document.size} -->
                    </p>
                </div>
                <div class="fr-ml-auto fr-my-auto">
                    <a
                        class="fr-link fr-links-group__title"
                        href={document.url}
                        title="Télécharger "
                        target="_blank"
                        rel="noopener noreferrer">
                        <span class="fr-icon-file-download-line" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .fr-card__title {
        color: var(--text-title-blue-france);
    }

    .fr-card__content {
        display: flex;
        flex-direction: row;
    }

    .fr-card {
        border-bottom: 1px var(--border-default-grey) solid;
    }

    .fr-card:hover {
        background-color: var(--background-alt-grey);
    }

    .fr-card.--active {
        background-color: var(--background-contrast-blue-france);
    }

    .fr-card__desc {
        min-height: unset;
    }
</style>

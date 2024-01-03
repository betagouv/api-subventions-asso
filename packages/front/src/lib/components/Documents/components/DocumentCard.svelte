<script>
    import { DocumentCardController } from "./DocumentCard.controller";
    import Card from "$lib/dsfr/Card.svelte";

    export let document;
    const controller = new DocumentCardController();
</script>

<Card
    title={document.label}
    titleTag="h4"
    titleStyle="h5"
    url={document.url}
    size="6"
    onClick={e => controller.onClick(e, document)}
    target="_blank">
    <p>{document.nom}</p>

    <p class="fr-mt-3v fr-mb-2w">
        Fournisseur du fichier : <b class="fr-ml-3v">{document.provider}</b>
    </p>
    <div class="separator" />
    <svelte:fragment slot="card-end">
        <p class="fr-text--sm fr-mb-0">
            <span class="fr-icon-calendar-2-line fr-mr-1w" />
            {controller.getDateString(document.date)}
        </p>
    </svelte:fragment>
</Card>

<style>
    .separator {
        border-top-width: 1px;
    }

    .fr-icon-calendar-2-line {
        color: var(--text-action-high-blue-france);
    }
</style>

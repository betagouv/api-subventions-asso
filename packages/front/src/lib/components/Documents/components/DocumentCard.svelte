<script>
    import { DocumentCardController } from "./DocumentCard.controller";
    import Card from "$lib/dsfr/Card.svelte";

    export let document;
    const controller = new DocumentCardController();
</script>

<Card
    title={document.label}
    titleTag="h4"
    url={document.url}
    size="6"
    onClick={e => controller.onClick(e, document)}
    target="_blank">
    <p>{document.nom}</p>

    <p class="fr-text--sm">
        Fournisseur du fichier: <b>{document.provider}</b>
    </p>
    <svelte:fragment slot="card-end">
        {controller.getDateString(document.date)}
    </svelte:fragment>
</Card>

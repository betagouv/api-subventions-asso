<script>
    import { EstablishmentPreviewController } from "@components/EstablishmentPreview/EstablishmentPreviewController";

    export let establishment;

    const { siret, status, address } = new EstablishmentPreviewController(establishment);
</script>

<p>
    {status}
    <br />
    SIRET : {siret}
    <br />
</p>
<div class="flex">
    <span class="fr-col-md-1 fr-mr-1w fr-icon-map-pin-2-line color" />
    <span class="fr-col-md-11 fr-text--bold">{address}</span>
</div>

<style>
    .color {
        color: var(--blue-france-sun-113-625);
    }
</style>

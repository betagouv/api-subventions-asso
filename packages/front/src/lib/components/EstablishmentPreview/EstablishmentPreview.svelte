<script lang="ts">
    import { EstablishmentPreviewController } from "$lib/components/EstablishmentPreview/EstablishmentPreviewController";

    export let establishment;
    export let small = false;

    const { siret, status, address } = new EstablishmentPreviewController(establishment);
</script>

<p class:fr-mb-0={small}>
    {status}
    <br />
    SIRET : {siret}
    <br />
</p>
<p>
    {#if !small}<span class="fr-mr-1w fr-icon-map-pin-2-line color" />{/if}
    <span class:fr-text--bold={!small}>{address}</span>
</p>

<style>
    .color {
        color: var(--text-active-blue-france);
    }
</style>

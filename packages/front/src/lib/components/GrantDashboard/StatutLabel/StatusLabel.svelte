<script>
    import { StatusLabelController } from "./StatusLabel.controller.js";

    export let status;

    const { label, classes } = new StatusLabelController(status);
</script>

{#if label}
    <p class="fr-badge fr-badge--sm {classes}">{label}</p>
{:else}
    <p>-</p>
{/if}

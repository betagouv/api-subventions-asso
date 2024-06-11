<script>
    import { StatusLabelController } from "./StatusLabel.controller";

    export let status;

    const { label, classes } = new StatusLabelController(status);
</script>

{#if label}
    <p class="fr-badge {classes}">{label}</p>
{:else}
    <p>-</p>
{/if}

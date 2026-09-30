<script lang="ts">
    import { StatusLabelController } from "./StatusLabel.controller";

    let { status } = $props();

    const { label, classes } = new StatusLabelController(status);
</script>

{#if label}
    <p class="fr-badge fr-badge--sm {classes}">{label}</p>
{:else}
    <p>-</p>
{/if}

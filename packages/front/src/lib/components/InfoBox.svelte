<script lang="ts">
    interface Props {
        title?: string | null;
        children?: import("svelte").Snippet;
    }

    let { title = null, children }: Props = $props();
</script>

<div class="background-custom-alt-blue-france fr-p-8v fr-mb-4v">
    {#if title}
        <p class="fr-text--lg fr-text--bold">{title}</p>
    {/if}

    {@render children?.()}
</div>

<style>
    .background-custom-alt-blue-france {
        background-color: var(--background-alt-blue-france);
    }
</style>

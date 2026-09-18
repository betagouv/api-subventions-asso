<script lang="ts">
    interface Props {
        title?: string | null;
        children?: import("svelte").Snippet;
    }

    let { title = null, children }: Props = $props();
</script>

<div class="widget fr-p-4w">
    {#if title}
        <h4 class="fr-h4 fr-mb-3w">{title}</h4>
    {/if}
    <div>
        {@render children?.()}
    </div>
</div>

<style>
    .widget {
        border: 1px solid var(--border-default-grey);
    }
</style>

<script lang="ts">
    interface Props {
        // undefined works for "left"
        position?: "top" | "bottom" | "center" | "right" | undefined;
        children?: import("svelte").Snippet;
    }

    let { position = undefined, children }: Props = $props();
</script>

<div class={`truncate fr-cell__desc ${position ? "fr-cell--" + position : ""}`}>{@render children?.()}</div>

<style>
    .truncate {
        display: -webkit-box;
        overflow: hidden;
        overflow-wrap: anywhere;
        -webkit-line-clamp: 4;
        line-clamp: 4;
        -webkit-box-orient: vertical;
    }
</style>

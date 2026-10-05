<script lang="ts">
    interface Props {
        id: string;
        position?: "top" | "bottom" | "right" | "left";
        children?: import("svelte").Snippet;
    }

    let { id, position = "bottom", children }: Props = $props();
</script>

<span role="tooltip" {id} class="fr-tooltip fr-placement fr-placement--{position}">
    {@render children?.()}
</span>

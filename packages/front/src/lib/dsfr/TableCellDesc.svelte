<script lang="ts">
    // undefined works for "left"
    export let position: "top" | "bottom" | "center" | "right" | undefined = undefined;
</script>

<div class={`truncate fr-cell__desc ${position ? "fr-cell--" + position : ""}`}><slot /></div>

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

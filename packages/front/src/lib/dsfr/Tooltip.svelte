<script lang="ts">
    export let id: string;
    export let position: "top" | "bottom" | "right" | "left" = "bottom";
</script>

<span role="tooltip" {id} class="fr-tooltip fr-placement fr-placement--{position}">
    <slot></slot>
</span>

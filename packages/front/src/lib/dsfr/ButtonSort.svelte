<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let sortDirection;
    export let id;

    const dispatch = createEventDispatcher<{ click: null }>();
</script>

<button {id} on:click={() => dispatch("click")} class="fr-btn--sort" aria-sort={sortDirection}></button>

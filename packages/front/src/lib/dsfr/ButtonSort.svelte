<script lang="ts">
    let { sortDirection, id, onclick = () => {} } = $props();
</script>

<button {id} {onclick} class="fr-btn--sort" aria-sort={sortDirection}></button>

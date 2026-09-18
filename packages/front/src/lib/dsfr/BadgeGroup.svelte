<script lang="ts">
    import Badge from "$lib/dsfr/Badge.svelte";

    let { badges = [] } = $props();
</script>

{#each badges as badge, index (index)}
    <ul class="fr-tags-group">
        <li>
            <Badge {...badge} />
        </li>
    </ul>
{/each}

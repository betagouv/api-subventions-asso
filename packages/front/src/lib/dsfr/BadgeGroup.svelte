<script>
    import Badge from "$lib/dsfr/Badge.svelte";

    export let badges = [];
</script>

{#each badges as badge}
    <ul class="fr-tags-group">
        <li>
            <Badge {...badge} />
        </li>
    </ul>
{/each}

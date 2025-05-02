<script lang="ts">
    import DocumentCard from "$lib/components/Documents/components/DocumentCard.svelte";

    export let documents;
    export let selectedDocs;
    export let title;
</script>

{#if documents.length}
    <h3 class="fr-h2 fr-mb-4w">{title}</h3>
    <section class="fr-ml-n2w">
        {#each documents as document, i (i)}
            <DocumentCard {document} bind:value={selectedDocs[i]} />
        {/each}
    </section>
{/if}

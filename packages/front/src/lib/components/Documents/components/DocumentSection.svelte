<script lang="ts">
    import DocumentCard from "$lib/components/Documents/components/DocumentCard.svelte";

    let { documents, selectedDocs = $bindable(), title } = $props();

    function updateSelectedDoc(index: number, value) {
        selectedDocs[index] = value;
        selectedDocs = [...selectedDocs];
    }
</script>

{#if documents.length}
    <h3 class="fr-h2 fr-mb-4w">{title}</h3>
    <section class="fr-ml-n2w">
        {#each documents as document, i (i)}
            <DocumentCard {document} value={selectedDocs[i]} onchange={value => updateSelectedDoc(i, value)} />
        {/each}
    </section>
{/if}

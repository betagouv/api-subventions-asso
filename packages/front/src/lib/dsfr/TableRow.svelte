<script lang="ts">
    interface Props {
        id: string;
        index: number;
        openModal?: boolean;
        children?: import("svelte").Snippet;
    }

    let { id, index, openModal = false, children }: Props = $props();
</script>

<tr
    aria-controls={openModal ? "fr-modal" : ""}
    data-fr-opened={openModal ? "true" : "false"}
    id="table-${id}-row-key-${index}"
    data-row-key={index}>
    {@render children?.()}
</tr>

<script lang="ts">
    import type { TableCell } from "$lib/dsfr/TableCell.types";
    import TableCellTitle from "$lib/dsfr/TableCellTitle.svelte";
    import TableCellDesc from "$lib/dsfr/TableCellDesc.svelte";

    interface Props {
        cells: TableCell[] | null;
        granted: boolean;
        onclick?: () => void;
    }

    let { cells, granted, onclick = () => {} }: Props = $props();

    const openModal = cells?.length;
    const cellsLength = 2;
</script>

{#if cells}
    {#each cells as cell, i (i)}
        <td
            class="clickable payment"
            {onclick}
            aria-controls={openModal ? "fr-modal" : ""}
            data-fr-opened={openModal ? "true" : "false"}>
            {#if cell.title}
                <TableCellTitle>{cell.title}</TableCellTitle>
            {/if}
            {#if cell.desc}
                <TableCellDesc>{cell.desc}</TableCellDesc>
            {/if}
        </td>
    {/each}
{:else if granted}
    <td colspan={cellsLength} class="fr-cell--center">Nous ne disposons pas encore de cette information.</td>
{:else}
    <td colspan={cellsLength}></td>
{/if}

<style>
    td.payment {
        padding: 1rem 0.5rem;
    }

    td.clickable {
        cursor: pointer;
    }

    :global(tr):has(:global(td.payment:hover)) td.clickable.payment,
    :global(tr):has(:global(td.payment:focus-within)) td.clickable.payment {
        background-color: var(--background-alt-grey);
    }
</style>

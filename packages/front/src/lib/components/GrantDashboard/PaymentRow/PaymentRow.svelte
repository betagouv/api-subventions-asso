<script lang="ts">
    import type { TableCell } from "$lib/dsfr/TableCell.types";
    import TableCellTitle from "$lib/dsfr/TableCellTitle.svelte";
    import TableCellDesc from "$lib/dsfr/TableCellDesc.svelte";

    export let cells: TableCell[] | null;
    export let granted: boolean;

    const cellsLength = 2;
</script>

{#if cells}
    {#each cells as cell}
        <td on:click>
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
    <td colspan={cellsLength} />
{/if}

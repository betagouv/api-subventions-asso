<script lang="ts">
    import Badge from "$lib/dsfr/Badge.svelte";
    import type { TableCell } from "$lib/dsfr/TableCell.types";
    import TableCellTitle from "$lib/dsfr/TableCellTitle.svelte";
    import TableCellDesc from "$lib/dsfr/TableCellDesc.svelte";
    import StatusLabel from "$lib/components/SubventionsPaymentsDashboard/StatutLabel/StatusLabel.svelte";

    export let cells: TableCell[] | null;

    const cellsLength = 6;
</script>

{#if cells}
    {#each cells as cell}
        <td on:click>
            {#if cell.badge}
                {#if cell.badge.status}
                    <StatusLabel status={cell.badge.status} />
                {:else}
                    <Badge {...cell.badge} />
                {/if}
            {/if}
            {#if !cell.badge && !cell.title && !cell.desc}
                <TableCellDesc>-</TableCellDesc>
            {:else}
                {#if cell.title}
                    <TableCellTitle>{cell.title}</TableCellTitle>
                {/if}
                {#if cell.desc}
                    <TableCellDesc>{cell.desc}</TableCellDesc>
                {/if}
            {/if}
        </td>
    {/each}
{:else}
    <td colspan={cellsLength} class="fr-cell--center">Nous ne disposons pas encore de cette information.</td>
{/if}

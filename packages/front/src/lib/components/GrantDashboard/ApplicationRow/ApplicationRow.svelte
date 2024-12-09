<script lang="ts">
    import Badge from "$lib/dsfr/Badge.svelte";
    import type { TableCell } from "$lib/dsfr/TableCell.types";
    import TableCellTitle from "$lib/dsfr/TableCellTitle.svelte";
    import TableCellDesc from "$lib/dsfr/TableCellDesc.svelte";
    import StatusLabel from "$lib/components/GrantDashboard/StatutLabel/StatusLabel.svelte";

    export let cells: TableCell[] | null;

    const openModal = cells?.length;
    const cellsLength = 6;
</script>

{#if cells}
    {#each cells as cell}
        <td
            class="clickable application"
            on:click
            aria-controls={openModal ? "fr-modal" : ""}
            data-fr-opened={openModal ? "true" : "false"}>
            {#if cell.badge}
                {#if cell.badge?.status}
                    <StatusLabel status={cell.badge.status} />
                {:else}
                    <Badge small={true} {...cell.badge} />
                {/if}
            {/if}
            {#if !cell.badge && !cell.title && !cell.desc}
                <TableCellDesc position="center">-</TableCellDesc>
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

<style>
    td {
        padding: 1rem 0.5rem;
    }

    td.clickable {
        cursor: pointer;
    }

    :global(tr):has(td.application:hover) td.clickable.application,
    :global(tr):has(td.application:focus-within) td.clickable.application {
        background-color: var(--background-alt-grey);
    }
</style>

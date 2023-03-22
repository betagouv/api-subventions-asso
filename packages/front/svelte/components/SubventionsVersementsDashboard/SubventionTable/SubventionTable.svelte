<script>
    import TableCell from "../../Tables/TableCell.svelte";
    import TableHead from "../../Tables/TableHead.svelte";
    import Table from "../../../dsfr/Table.svelte";

    import SubventionTableController from "./SubventionTable.controller";
    import StatusLabel from "@components/SubventionsVersementsDashboard/SubventionTable/StatutLabel/StatusLabel.svelte";

    export let sort;
    export let elements = [];
    export let currentSort = null;
    export let sortDirection = null;

    const controller = new SubventionTableController(sort);

    const { elementsDataViews, columnDataViews } = controller;

    $: elements, controller.updateElements(elements);
    $: currentSort, controller.sort(currentSort);
</script>

<Table>
    <svelte:fragment slot="colgroup">
        <colgroup>
            <col class="col-120" />
            <col class="col-170" />
            <col class="col-170" />
            <col class="col-100" />
            <col class="col-190" />
        </colgroup>
    </svelte:fragment>
    <svelte:fragment slot="head">
        {#each $columnDataViews as columnData}
            {#if columnData.haveAction}
                <TableHead action={columnData.action} actionActive={columnData.active} actionDirection={sortDirection}>
                    {columnData.label}
                </TableHead>
            {:else}
                <TableHead>{columnData.label}</TableHead>
            {/if}
        {/each}
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each $elementsDataViews as elementData}
            <tr
                class:clickable={elementData?.hasMoreInfo}
                aria-controls={elementData?.hasMoreInfo ? "fr-modal" : undefined}
                data-fr-opened={elementData?.hasMoreInfo ? "false" : undefined}
                on:click={() => controller.onRowClick(elementData)}>
                {#if !elementData}
                    <TableCell colspan="5" position="center">
                        Nous ne disposons pas encore de cette information
                    </TableCell>
                    <TableCell primary={true} position="end">?</TableCell>
                {:else}
                    <TableCell>{elementData.serviceInstructeur}</TableCell>
                    <TableCell>
                        {elementData.dispositif}
                    </TableCell>
                    <TableCell position={elementData.projectNamePosition}>
                        {elementData.projectName}
                    </TableCell>
                    <TableCell position="end">
                        {elementData.montantsDemande}
                    </TableCell>
                    <TableCell position="end" primary="true">
                        {#if elementData.showAmount}
                            {elementData.montantsAccorde}
                        {:else}
                            <StatusLabel status={elementData.status} />
                            <!--
                        What follows is an a11y trick: users can focus this on keyboard.
                        This button should always be positioned at the end of clickable rows and repeat the on:click event of the row
                        -->
                            <button class="sr-only" disabled={elementData?.hasMoreInfo ? undefined : "true"}>
                                Voir plus
                            </button>
                        {/if}
                    </TableCell>
                {/if}
            </tr>
        {/each}
    </svelte:fragment>
</Table>

<style>
    .col-170 {
        width: 170px;
        max-width: 170px;
    }

    .col-120 {
        width: 120px;
        max-width: 120px;
    }

    .col-100 {
        width: 100px;
        max-width: 100px;
    }

    .col-190 {
        width: 190px;
        max-width: 190px;
    }
</style>

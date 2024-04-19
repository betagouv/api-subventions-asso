<script>
    import TableCell from "../../Tables/TableCell.svelte";
    import TableHead from "../../Tables/TableHead.svelte";
    import SubventionTableController from "./SubventionTable.controller";
    import Table from "$lib/dsfr/Table.svelte";

    import StatusLabel from "$lib/components/SubventionsVersementsDashboard/SubventionTable/StatutLabel/StatusLabel.svelte";

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
    <svelte:fragment slot="head">
        {#each $columnDataViews as columnData}
            {#if columnData.haveAction}
                <TableHead
                    size={columnData.size}
                    action={columnData.action}
                    actionActive={columnData.active}
                    actionDirection={sortDirection}>
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
                class:clickable={elementData}
                aria-controls={elementData ? "fr-modal" : undefined}
                data-fr-opened={elementData ? "false" : undefined}
                on:click={() => controller.onRowClick(elementData)}>
                {#if !elementData}
                    <TableCell colspan="6" position="center">Nous ne disposons pas de cette information.</TableCell>
                {:else}
                    <TableCell>
                        {elementData.establishmentPostcode}
                    </TableCell>
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
                        <!-- We need #key because StatusLabelController does not see that elementData changes and StatusLabel is not natively rebuilt -->
                        {#key elementData.status}
                            {#if controller.isAccepted(elementData.status)}
                                {elementData.montantsAccorde}
                            {:else}
                                <StatusLabel status={elementData.status} />
                            {/if}
                        {/key}
                        <!--
                        What follows is an a11y trick: users can focus this on keyboard.
                        This button should always be positioned at the end of clickable rows and repeat the on:click event of the row
                        -->
                        <button class="fr-sr-only">Voir plus</button>
                    </TableCell>
                {/if}
            </tr>
        {/each}
    </svelte:fragment>
</Table>

<script>
    import TableCell from "../../Tables/TableCell.svelte";
    import TableHead from "../../Tables/TableHead.svelte";
    import Table from "../../../dsfr/Table.svelte";

    import { modal, data } from "../../../store/modal.store";

    import SubventionInfoModal from "../Modals/SubventionInfoModal.svelte";
    import SubventionTableController from "./SubventionTable.controller";
    import StatusLabel from "@components/SubventionsVersementsDashboard/SubventionTable/StatutLabel/StatusLabel.svelte";

    export let sort;
    export let elements = [];
    export let currentSort = null;
    export let sortDirection = null;

    const controller = new SubventionTableController(sort);

    const { elementsDataViews, columnDataViews } = controller;

    const displayModal = subvention => {
        if (!subvention) return;
        data.update(() => ({ subvention }));
        modal.update(() => SubventionInfoModal);
    };

    $: elements, controller.updateElements(elements);
    $: currentSort, controller.sort(currentSort);
</script>

<Table>
    <svelte:fragment slot="colgroup">
        <colgroup>
            <col class="col-120" />
            <col class="col-120" />
            <col class="col-140" />
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
                class:clickable={elementData?.enableButtonMoreInfo}
                aria-controls={elementData?.enableButtonMoreInfo ? "fr-modal" : undefined}
                data-fr-opened={elementData?.enableButtonMoreInfo ? "false" : undefined}
                on:click={() => displayModal(elementData?.subvention)}>
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
                        {/if}
                    </TableCell>
                {/if}
            </tr>
        {/each}
    </svelte:fragment>
</Table>

<style>
    .col-140 {
        width: 140px;
        max-width: 140px;
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

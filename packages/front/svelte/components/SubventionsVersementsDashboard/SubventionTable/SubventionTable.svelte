<script>
    import TableCell from "../../TableCell.svelte";
    import TableHead from "../../TableHead.svelte";
    import Button from "../../../dsfr/Button.svelte";
    import Table from "../../../dsfr/Table.svelte";

    import { modal, data } from "../../../store/modal.store";

    import SubventionTableController from "./SubventionTable.controller";
    import SubventionInfoModal from "../Modals/SubventionInfoModal.svelte";

    export let sort;
    export let elements = [];
    export let currentSort = null;
    export let sortDirection = null;

    const controller = new SubventionTableController(sort);

    const { elementsDataViews, columnDataViews } = controller;

    const displayModal = subvention => {
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
            <col class="col-80" />
            <col class="col-100" />
            <col class="col-100" />
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
            <tr>
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
                    <TableCell position="center" overflow="visible">
                        {#if elementData.enableButtonMoreInfo}
                            <Button
                                icon="information-line"
                                ariaControls="fr-modal"
                                on:click={() => displayModal(elementData.subvention)} />
                        {:else}
                            <div class="tooltip-wrapper">
                                <span class="tooltip">Nous ne disposons pas de plus d'informations</span>
                                <Button disabled="true" icon="information-line" />
                            </div>
                        {/if}
                    </TableCell>
                    <TableCell position="end">
                        {elementData.montantsDemande}
                    </TableCell>
                    <TableCell primary={true} position="end">
                        {elementData.montantsAccordeOrStatus}
                    </TableCell>
                {/if}
            </tr>
        {/each}
    </svelte:fragment>
</Table>

<style>
    /* This is a quick fix and if needed a Tooltip component should be made */
    .tooltip-wrapper {
        position: relative;
    }

    .tooltip-wrapper .tooltip {
        top: -40px;
        left: -139px;
    }

    .tooltip {
        display: none;
        position: absolute;
        color: #fff;
        background-color: #555;
        padding: 5px;
        border-radius: 6px;
        white-space: nowrap;
    }

    .tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    .tooltip-wrapper:hover > span.tooltip {
        display: block;
    }

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

    .col-80 {
        width: 80px;
        max-width: 80px;
    }
</style>

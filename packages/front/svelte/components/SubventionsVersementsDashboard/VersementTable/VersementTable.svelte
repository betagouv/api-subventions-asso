<script>
    import TableCell from "../../TableCell.svelte";
    import TableHead from "../../TableHead.svelte";
    import Table from "../../../dsfr/Table.svelte";

    import { modal, data } from "../../../store/modal.store";
    import { VersementTableController } from "./VersementTable.controller";
    import VersementsInfoModal from "../Modals/VersementsInfoModal.svelte";

    export let sort;
    export let elements = [];
    export let currentSort = null;
    export let sortDirection = null;

    const controller = new VersementTableController(sort);

    const { noVersements, elementsDataViews, columnDataViews } = controller;

    const displayModal = versements => {
        data.update(() => ({ versements }));
        modal.update(() => VersementsInfoModal);
    };

    $: elements, controller.updateElements(elements);
    $: currentSort, controller.sort(currentSort);
</script>

<Table>
    <svelte:fragment slot="colgroup">
        <colgroup>
            <col class="col-100" />
            <col />
            <col class="col-110" />
        </colgroup>
    </svelte:fragment>
    <svelte:fragment slot="head">
        {#each $columnDataViews as columnDataView}
            <TableHead
                action={columnDataView.action}
                actionActive={columnDataView.active}
                actionDirection={sortDirection}
                actionDisable={$noVersements}>
                {columnDataView.label}
            </TableHead>
        {/each}
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each $elementsDataViews as element}
            {#if !element}
                <tr>
                    <TableCell colspan="3" />
                </tr>
            {:else}
                <tr
                    on:click={() => displayModal(element.versementsModal)}
                    aria-controls="fr-modal"
                    data-fr-opened="false"
                    class="clickable">
                    <TableCell primary="true" position="end">
                        {element.totalAmount}
                    </TableCell>
                    <TableCell>{element.centreFinancier}</TableCell>
                    <TableCell>
                        {element.lastVersementDate}
                    </TableCell>
                </tr>
            {/if}
        {/each}
    </svelte:fragment>
</Table>

<style>
    .col-100 {
        width: 100px;
        max-width: 100px;
    }

    .col-110 {
        width: 110px;
        max-width: 110px;
    }

    tr.clickable {
        cursor: pointer;
    }
</style>

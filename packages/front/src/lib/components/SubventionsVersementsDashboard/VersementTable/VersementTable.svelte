<script>
    import TableCell from "../../Tables/TableCell.svelte";
    import TableHead from "../../Tables/TableHead.svelte";

    import VersementsInfoModal from "../Modals/VersementsInfoModal.svelte";
    import NumberTableCell from "../../Tables/NumberTableCell.svelte";
    import VersementTableController from "./VersementTable.controller";
    import { modal, data } from "$lib/store/modal.store";
    import Table from "$lib/dsfr/Table.svelte";
    import trackerService from "$lib/services/tracker.service";

    export let sort;
    export let elements = [];
    export let currentSort = null;
    export let sortDirection = null;

    const controller = new VersementTableController(sort);

    const { noVersements, elementsDataViews, columnDataViews } = controller;

    const displayModal = versements => {
        trackerService.buttonClickEvent("association-etablissement.dashbord.versement.more_information");
        data.update(() => ({ versements }));
        modal.update(() => VersementsInfoModal);
    };

    $: elements, controller.updateElements(elements);
    $: currentSort, controller.sort(currentSort);
</script>

<Table>
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
                    <TableCell colspan="3" position="center">Nous ne disposons pas de cette information.</TableCell>
                </tr>
            {:else}
                <tr
                    on:click={() => displayModal(element.versementsModal)}
                    aria-controls="fr-modal"
                    data-fr-opened="false"
                    class="clickable">
                    <NumberTableCell primary="true" value={element.totalAmount} />
                    <TableCell>
                        {element.lastVersementDate}
                    </TableCell>
                    <TableCell position="end">
                        {element.bop}
                        <!--
                            What follows is an a11y trick: users can focus this on keyboard.
                            This button should always be positioned at the end of clickable rows and repeat the on:click event of the row
                        -->
                        <button class="fr-sr-only">Voir plus</button>
                    </TableCell>
                </tr>
            {/if}
        {/each}
    </svelte:fragment>
</Table>

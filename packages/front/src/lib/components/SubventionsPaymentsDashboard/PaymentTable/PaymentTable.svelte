<script>
    import TableCell from "../../Tables/TableCell.svelte";
    import TableHead from "../../Tables/TableHead.svelte";

    import PaymentsInfoModal from "../Modals/PaymentsInfoModal.svelte";
    import NumberTableCell from "../../Tables/NumberTableCell.svelte";
    import PaymentTableController from "./PaymentTable.controller";
    import { modal, data } from "$lib/store/modal.store";
    import Table from "$lib/dsfr/Table.svelte";
    import trackerService from "$lib/services/tracker.service";

    export let sort;
    export let elements = [];
    export let currentSort = null;
    export let sortDirection = null;

    const controller = new PaymentTableController(sort);

    const { noPayments, elementsDataViews, columnDataViews } = controller;

    const displayModal = payments => {
        trackerService.buttonClickEvent("association-etablissement.dashbord.payment.more_information");
        data.update(() => ({ payments }));
        modal.update(() => PaymentsInfoModal);
    };

    $: elements, controller.updateElements(elements);
    $: currentSort, controller.sort(currentSort);
</script>

<Table multiline={true} custom={true}>
    <svelte:fragment slot="head">
        {#each $columnDataViews as columnDataView}
            <TableHead
                action={columnDataView.action}
                actionActive={columnDataView.active}
                actionDirection={sortDirection}
                actionDisable={$noPayments}>
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
                    on:click={() => displayModal(element.paymentsModal)}
                    aria-controls="fr-modal"
                    data-fr-opened="false"
                    class="clickable">
                    <NumberTableCell primary="true" value={element.totalAmount} position="start" />
                    <TableCell>
                        {element.programme}
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

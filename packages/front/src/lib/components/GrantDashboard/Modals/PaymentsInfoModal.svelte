<script>
    import Table from "$lib/dsfr/Table.svelte";
    import TableSlotCell from "$lib/dsfr/TableSlotCell.svelte";

    import { data } from "$lib/store/modal.store";

    const headers = ["Montant", "Domaine fonctionnel", "Activité", "Centre financier", "Date", "Programme"];
    const tableId = "payments-modal";
</script>

{#if $data.payments}
    <Table id={tableId} {headers}>
        {#each $data.payments as payment, index}
            <TableSlotCell id={tableId} {index}>
                <td class="primary">{payment.amount}</td>
                <td>{payment.domaineFonctionnel}</td>
                <td>{payment.activitee}</td>
                <td>{payment.centreFinancier}</td>
                <td>{payment.date}</td>
                <td>{payment.programme}</td>
            </TableSlotCell>
        {/each}
    </Table>
{/if}

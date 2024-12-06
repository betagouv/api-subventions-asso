<script>
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";

    import { data } from "$lib/store/modal.store";
    import { numberToEuro } from "$lib/helpers/dataHelper.js";
    import { dateToDDMMYYYY } from "$lib/helpers/dateHelper.js";

    const headers = ["Montant", "Domaine fonctionnel", "Activité", "Centre financier", "Date", "Programme"];
    const tableId = "payments-modal";
</script>

{#if $data.payments}
    <Table id={tableId} {headers}>
        {#each $data.payments as payment, index}
            <TableRow id={tableId} {index}>
                <td class="primary">{numberToEuro(payment.amount)}</td>
                <td>{payment.domaineFonctionnel}</td>
                <td>{payment.activitee}</td>
                <td>{payment.centreFinancier}</td>
                <td>{dateToDDMMYYYY(new Date(payment.dateOperation))}</td>
                <td>{payment.programme}</td>
            </TableRow>
        {/each}
    </Table>
{/if}

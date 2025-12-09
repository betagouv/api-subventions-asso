<script>
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";

    import { data } from "$lib/store/modal.store";
    import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper.js";
    import { dateToDDMMYYYY } from "$lib/helpers/dateHelper";

    const headers = ["Montant", "Domaine fonctionnel", "Activité", "Centre financier", "Date", "Programme"];
    const tableId = "payments-modal";
</script>

{#if $data.payments}
    <Table id={tableId} {headers}>
        {#each $data.payments as payment, index (index)}
            <TableRow id={tableId} {index} title="Détail des versements" hideTitle={true}>
                <td class="primary">{valueOrHyphen(numberToEuro(payment.montant))}</td>
                <td>{valueOrHyphen(payment.action)}</td>
                <td>{valueOrHyphen(payment.activite)}</td>
                <td>{valueOrHyphen(payment.libelleCentreFinancier)}</td>
                <td>{valueOrHyphen(dateToDDMMYYYY(new Date(payment.dateOperation)))}</td>
                <td>{payment.programme ? `${payment.numeroProgramme} - ${valueOrHyphen(payment.programme)}` : "-"}</td>
            </TableRow>
        {/each}
    </Table>
{/if}

<script>
    import TableHead from "../../Tables/TableHead.svelte";
    import StringTableCell from "../../Tables/StringTableCell.svelte";
    import Table from "$lib/dsfr/Table.svelte";

    import { data } from "$lib/store/modal.store";
</script>

{#if $data.payments}
    <Table>
        <svelte:fragment slot="head">
            <TableHead>Montant</TableHead>
            <TableHead>Domaine fonctionnel</TableHead>
            <TableHead>Activité</TableHead>
            <TableHead>Centre financier</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Programme</TableHead>
        </svelte:fragment>
        <svelte:fragment slot="body">
            {#each $data.payments as payment}
                <tr>
                    <StringTableCell primary="true" value={payment.amount} />
                    <StringTableCell value={payment.domaineFonctionnel} />
                    <StringTableCell value={payment.activitee} />
                    <StringTableCell value={payment.centreFinancier} />
                    <StringTableCell value={payment.date} />
                    <StringTableCell value={payment.programme} />
                </tr>
            {/each}
        </svelte:fragment>
    </Table>
{/if}

<style>
</style>

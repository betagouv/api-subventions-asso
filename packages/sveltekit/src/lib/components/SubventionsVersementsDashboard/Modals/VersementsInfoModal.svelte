<script>
    import Table from "$lib/dsfr/Table.svelte";
    import TableHead from "../../Tables/TableHead.svelte";
    import StringTableCell from "../../Tables/StringTableCell.svelte";

    import { data } from "../../../store/modal.store";
</script>

{#if $data.versements}
    <Table>
        <svelte:fragment slot="head">
            <TableHead>Montant</TableHead>
            <TableHead>Domaine fonctionnel</TableHead>
            <TableHead>Activité</TableHead>
            <TableHead>Centre financier</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>BOP</TableHead>
        </svelte:fragment>
        <svelte:fragment slot="body">
            {#each $data.versements as versement}
                <tr>
                    <StringTableCell primary="true" value={versement.amount} />
                    <StringTableCell value={versement.domaineFonctionnel} />
                    <StringTableCell value={versement.activitee} />
                    <StringTableCell value={versement.centreFinancier} />
                    <StringTableCell value={versement.date} />
                    <StringTableCell value={versement.bop} />
                </tr>
            {/each}
        </svelte:fragment>
    </Table>
{/if}

<style>
</style>

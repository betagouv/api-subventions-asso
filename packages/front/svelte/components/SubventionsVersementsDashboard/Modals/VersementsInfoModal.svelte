<script>
    import Table from "../../../dsfr/Table.svelte";
    import TableHead from "../../Tables/TableHead.svelte";

    import { data } from "../../../store/modal.store";
    import StringTableCell from "../../Tables/StringTableCell.svelte";
</script>

{#if $data.versements}
    <Table>
        <svelte:fragment slot="head">
            <TableHead>Montant</TableHead>
            <TableHead>Domaine fonctionnel</TableHead>
            <TableHead>Activité</TableHead>
            <TableHead>Centre financier</TableHead>
            <TableHead>Date</TableHead>
        </svelte:fragment>
        <svelte:fragment slot="body">
            {#each $data.versements as versement}
                <tr>
                    <StringTableCell primary="true" value={versement.amount} />
                    <StringTableCell value={versement.domaineFonctionnel} />
                    <StringTableCell value={versement.activitee} />
                    <StringTableCell value={versement.centreFinancier} />
                    <StringTableCell value={versement.dateOperation} />
                </tr>
            {/each}
        </svelte:fragment>
    </Table>
{/if}

<style>
</style>

<script>
    import Table from "../../../dsfr/Table.svelte";
    import TableHead from "../../TableHead.svelte";
    import TableCell from "../../TableCell.svelte";

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
        </svelte:fragment>
        <svelte:fragment slot="body">
            {#each $data.versements as versement}
                <tr>
                    <TableCell primary="true" position="center">{versement.amount}</TableCell>
                    <TableCell position="center">{versement.domaineFonctionnel}</TableCell>
                    <TableCell position="center">{versement.activitee}</TableCell>
                    <TableCell position="center">{versement.centreFinancier}</TableCell>
                    <TableCell position="center">
                        {versement.dateOperation}
                    </TableCell>
                </tr>
            {/each}
        </svelte:fragment>
    </Table>
{/if}

<style>
</style>

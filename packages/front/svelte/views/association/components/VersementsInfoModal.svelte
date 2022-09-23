<script>
    import Table from "../../../dsfr/Table.svelte";
    import TableHead from "../../../components/TableHead.svelte";
    import TableCell from "../../../components/TableCell.svelte";
    import { numberToEuro, valueOrHyphen } from "../../../helpers/dataHelper";
    import { data } from "../../../store/modal.store";
    import { withTwoDigitYear } from "../../../helpers/dateHelper";
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
                    <TableCell primary="true" position="center">{numberToEuro(versement.amount)}</TableCell>
                    <TableCell position="center">{versement.domaineFonctionnel || versement.codePoste}</TableCell>
                    <TableCell position="center">{valueOrHyphen(versement.activitee)}</TableCell>
                    <TableCell position="center">{valueOrHyphen(versement.centreFinancier)}</TableCell>
                    <TableCell position="center">
                        {withTwoDigitYear(new Date(versement.dateOperation)).slice(0, 8)}
                    </TableCell>
                </tr>
            {/each}
        </svelte:fragment>
    </Table>
{/if}

<style>
</style>

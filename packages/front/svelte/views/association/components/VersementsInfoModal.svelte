<script>
    import Modal from "../../../dsfr/Modal.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import TableHead from "../../../components/TableHead.svelte";
    import TableCell from "../../../components/TableCell.svelte";
    import { numberToEuro } from "../../../helpers/dataHelper";

    import { withTwoDigitYear } from "../../../helpers/dateHelper";

    export let versements;
    export let id;
</script>

<Modal title="Détail des versements" modalId={id}>
    <svelte:fragment slot="content">
        {#if versements}
            <Table>
                <svelte:fragment slot="head">
                    <TableHead>Montant</TableHead>
                    <TableHead>Domaine fonctionnel</TableHead>
                    <TableHead>Activité</TableHead>
                    <TableHead>Centre financier</TableHead>
                    <TableHead>Date</TableHead>
                </svelte:fragment>
                <svelte:fragment slot="body">
                    {#each versements as versement}
                        <tr>
                            <TableCell primary="true" position="center">{numberToEuro(versement.amount)}</TableCell>
                            <TableCell position="center">{versement.domaineFonctionnel}</TableCell>
                            <TableCell position="center">{versement.activitee}</TableCell>
                            <TableCell position="center">{versement.centreFinancier}</TableCell>
                            <TableCell position="center">
                                {withTwoDigitYear(new Date(versement.dateOperation)).slice(0, 8)}
                            </TableCell>
                        </tr>
                    {/each}
                </svelte:fragment>
            </Table>
        {/if}
    </svelte:fragment>
</Modal>

<style>
</style>

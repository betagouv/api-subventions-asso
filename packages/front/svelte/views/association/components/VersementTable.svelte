<script>
    import TableCell from "../../../components/TableCell.svelte";

    import Button from "../../../dsfr/Button.svelte";
    import Table from "../../../dsfr/Table.svelte";

    export let versements = [];
    console.log({ versements });
</script>

<Table>
    <svelte:fragment slot="head">
        <th scope="col">Quel montant a été versé ?</th>
        <th scope="col">Quel service a effectué le versement ?</th>
        <th scope="col">À quelle date ?</th>
        <th scope="col">+ d'infos CERFA</th>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each versements as versement}
            <tr>
                <TableCell primary="true">12950</TableCell>
                <TableCell>SDPVC</TableCell>
                <TableCell>05/11/2021</TableCell>
                <TableCell><Button icon="fr-icon-arrow-up-line" /></TableCell>
            </tr>
        {/each}
    </svelte:fragment>
</Table>

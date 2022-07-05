<script>
    import TableCell from "../../../components/TableCell.svelte";

    import Button from "../../../dsfr/Button.svelte";
    import Table from "../../../dsfr/Table.svelte";

    export let subventions = [];
    subventions.push({ noMatch: true });
    console.log({ subventions });
</script>

<Table>
    <svelte:fragment slot="head">
        <th scope="col">À qui a été adressé la demande ?</th>
        <th scope="col">À quelle date ?</th>
        <th scope="col">Pour quel projet la demande a-t-elle été faite ?</th>
        <th scope="col">Plus d'infos</th>
        <th scope="col">Quel montant demandé ?</th>
        <th scope="col">Quel montant accordé ?</th>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each subventions as subvention}
            <tr>
                {#if subvention.noMatch}
                    <td colspan="5">
                        <Button>Je cherche davantage d'informations sur cette demande</Button>
                        <TableCell primary="true">?</TableCell>
                    </td>
                {:else}
                    <TableCell>{subvention.service_instructeur}</TableCell>
                    <TableCell>{subvention.creer_le}</TableCell>
                    <TableCell>{subvention.creer_le}</TableCell>
                    <TableCell>{subvention.creer_le}</TableCell>
                    <TableCell>{subvention.creer_le}</TableCell>
                {/if}
                <TableCell primary="true">{subvention.creer_le}</TableCell>
            </tr>
        {/each}
    </svelte:fragment>
</Table>

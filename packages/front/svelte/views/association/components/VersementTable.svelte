<script>
    import { numberToEuro } from "../../../helpers/dataHelper";
    import { getLastVersementsDate } from "../association.helper";

    import TableCell from "../../../components/TableCell.svelte";
    import Table from "../../../dsfr/Table.svelte";

    export let elements = [];

    const countTotal = versements => {
        return versements.reduce((acc, versement) => acc + versement.amount, 0);
    };
</script>

<Table>
    <svelte:fragment slot="head">
        <th scope="col">Quel montant a été versé ?</th>
        <th scope="col">Quel service a effectué le versement ?</th>
        <th scope="col">À quelle date le dernier versement à t-il eu lieu ?</th>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each elements as element}
            <tr>
                {#if !element.versements}
                    <td colspan="3" />
                {:else}
                    <TableCell primary="true">
                        {numberToEuro(countTotal(element.versements))}
                    </TableCell>
                    <TableCell>{element.versements[0].centreFinancier}</TableCell>
                    <TableCell>{getLastVersementsDate(element.versements).toLocaleDateString()}</TableCell>
                {/if}
            </tr>
        {/each}
    </svelte:fragment>
</Table>

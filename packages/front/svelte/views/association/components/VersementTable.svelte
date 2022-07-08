<script>
    import { numberToEuro } from "../../../helpers/dataHelper";
    import { getLastVersementsDate } from "../association.helper";

    import TableCell from "../../../components/TableCell.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import TableHead from "../../../components/TableHead.svelte";

    export let elements = [];

    const countTotal = versements => {
        return versements.reduce((acc, versement) => acc + versement.amount, 0);
    };

    const formatDate = date => {
        const dateArray = date.split("/");
        const [day, month, year] = dateArray;
        return `${day}/${month}<br>/${year}`;
    };
</script>

<Table>
    <svelte:fragment slot="head">
        <TableHead action={() => console.log("filter")}>Quel montant a été versé ?</TableHead>
        <TableHead action={() => console.log("filter")}>Quel service a effectué le versement ?</TableHead>
        <TableHead action={() => console.log("filter")}>À quelle date le dernier versement à t-il eu lieu ?</TableHead>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each elements as element}
            <tr>
                {#if !element.versements}
                    <TableCell colspan="3" />
                {:else}
                    <TableCell primary="true">
                        {numberToEuro(countTotal(element.versements))}
                    </TableCell>
                    <TableCell>{element.versements[0].centreFinancier}</TableCell>
                    <TableCell>
                        {@html formatDate(getLastVersementsDate(element.versements).toLocaleDateString())}
                    </TableCell>
                {/if}
            </tr>
        {/each}
    </svelte:fragment>
</Table>

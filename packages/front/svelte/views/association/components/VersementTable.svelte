<script>
    import { numberToEuro } from "../../../helpers/dataHelper";
    import { getLastVersementsDate } from "../association.helper";
    import { breakDateYear } from "../../../helpers/dateHelper";
    import TableCell from "../../../components/TableCell.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import TableHead from "../../../components/TableHead.svelte";

    export let elements = [];
    export let sort = () => {};
    export let currentSort = null;
    export let sortDirection = null;

    const countTotal = versements => {
        return versements.reduce((acc, versement) => acc + versement.amount, 0);
    };
</script>

<Table>
    <svelte:fragment slot="colgroup">
        <colgroup>
            <col class="col-120" />
            <col class="col-160" />
            <col class="col-80" />
        </colgroup>
    </svelte:fragment>
    <svelte:fragment slot="head">
        <TableHead
            action={() => sort("versement.montant")}
            actionActive={currentSort === "versement.montant"}
            actionDirection={sortDirection}>
            Quel montant versé ?
        </TableHead>
        <TableHead
            action={() => sort("versement.centreFinancier")}
            actionActive={currentSort === "versement.centreFinancier"}
            actionDirection={sortDirection}>
            Quel service a effectué le versement ?
        </TableHead>
        <TableHead
            action={() => sort("versement.date")}
            actionActive={currentSort === "versement.date"}
            actionDirection={sortDirection}>
            À quelle date ?
        </TableHead>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each elements as element}
            <tr>
                {#if !element.versements}
                    <TableCell colspan="3" />
                {:else}
                    <TableCell primary="true" position="end">
                        {numberToEuro(countTotal(element.versements))}
                    </TableCell>
                    <TableCell>{element.versements[0].centreFinancier}</TableCell>
                    <TableCell>
                        {@html breakDateYear(getLastVersementsDate(element.versements).toLocaleDateString())}
                    </TableCell>
                {/if}
            </tr>
        {/each}
    </svelte:fragment>
</Table>

<style>
    .col-160 {
        width: 160px;
        max-width: 160px;
    }

    .col-120 {
        width: 120px;
        max-width: 120px;
    }

    .col-80 {
        width: 80px;
        max-width: 80px;
    }
</style>

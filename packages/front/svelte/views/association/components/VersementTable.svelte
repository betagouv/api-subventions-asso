<script>
    import { numberToEuro } from "../../../helpers/dataHelper";
    import { getLastVersementsDate } from "../association.helper";
    import { breakDateYear } from "../../../helpers/dateHelper";
    import TableCell from "../../../components/TableCell.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import TableHead from "../../../components/TableHead.svelte";
    import VersementsInfoModal from "./VersementsInfoModal.svelte";

    export let elements = [];
    export let sort = () => {};
    export let currentSort = null;
    export let sortDirection = null;

    let selectedVersements = null;

    const countTotal = versements => {
        return versements.reduce((acc, versement) => acc + versement.amount, 0);
    };

    const onTRClick = element => {
        if (element.versements) selectedVersements = element.versements;
    };

    const countVersements = elements => {
        return elements.filter(e => e.versements?.length).length;
    };

    let noVersements = false;

    const updateNoVersements = () => (noVersements = !countVersements(elements));

    $: elements, updateNoVersements();
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
            actionDirection={sortDirection}
            actionDisable={noVersements}>
            Quel montant versé ?
        </TableHead>
        <TableHead
            action={() => sort("versement.centreFinancier")}
            actionActive={currentSort === "versement.centreFinancier"}
            actionDirection={sortDirection}
            actionDisable={noVersements}>
            Quel service a effectué le versement ?
        </TableHead>
        <TableHead
            action={() => sort("versement.date")}
            actionActive={currentSort === "versement.date"}
            actionDirection={sortDirection}
            actionDisable={noVersements}>
            À quelle date ?
        </TableHead>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each elements as element, key}
            {#if !element.versements}
                <tr>
                    <TableCell colspan="3" />
                </tr>
            {:else}
                <tr
                    on:click={() => onTRClick(element)}
                    aria-controls="fr-modal-versements-modal"
                    data-fr-opened="false"
                    class="clickabel">
                    <TableCell primary="true" position="end">
                        {numberToEuro(countTotal(element.versements))}
                    </TableCell>
                    <TableCell>{element.versements[0].centreFinancier}</TableCell>
                    <TableCell>
                        {@html breakDateYear(getLastVersementsDate(element.versements).toLocaleDateString())}
                    </TableCell>
                </tr>
            {/if}
        {/each}
    </svelte:fragment>
</Table>

<VersementsInfoModal versements={selectedVersements} id="versements-modal" />

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

    tr.clickabel {
        cursor: pointer;
    }
</style>

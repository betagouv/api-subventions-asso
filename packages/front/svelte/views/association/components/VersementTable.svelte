<script>
    import { numberToEuro } from "../../../helpers/dataHelper";
    import { withTwoDigitYear } from "../../../helpers/dateHelper";
    import { getLastVersementsDate } from "../association.helper";
    import TableCell from "../../../components/TableCell.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import TableHead from "../../../components/TableHead.svelte";
    import VersementsInfoModal from "./VersementsInfoModal.svelte";

    export let elements = [];
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
            <col class="col-100" />
            <col />
            <col class="col-110" />
        </colgroup>
    </svelte:fragment>
    <svelte:fragment slot="head">
        <TableHead
            action={() => sort("versement.montant")}
            actionActive={currentSort === "versement.montant"}
            actionDirection={sortDirection}
            actionDisable={noVersements}>
            Montant versé
        </TableHead>
        <TableHead
            action={() => sort("versement.centreFinancier")}
            actionActive={currentSort === "versement.centreFinancier"}
            actionDirection={sortDirection}
            actionDisable={noVersements}>
            Centre financier
        </TableHead>
        <TableHead
            action={() => sort("versement.date")}
            actionActive={currentSort === "versement.date"}
            actionDirection={sortDirection}
            actionDisable={noVersements}>
            <p>Date du versement</p>
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
                        {withTwoDigitYear(getLastVersementsDate(element.versements))}
                    </TableCell>
                </tr>
            {/if}
        {/each}
    </svelte:fragment>
</Table>

<VersementsInfoModal versements={selectedVersements} id="versements-modal" />

<style>
    .col-100 {
        width: 100px;
        max-width: 100px;
    }

    .col-110 {
        width: 110px;
        max-width: 110px;
    }

    tr.clickabel {
        cursor: pointer;
    }
</style>

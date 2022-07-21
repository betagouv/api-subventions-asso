<script>
    import TableCell from "../../../components/TableCell.svelte";
    import TableHead from "../../../components/TableHead.svelte";
    import Button from "../../../dsfr/Button.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import { valueOrHyphen, numberToEuro } from "../../../helpers/dataHelper";
    import { breakDateYear } from "../../../helpers/dateHelper";
    import helpers from "../../../../src/shared/helpers/EJSHelper";

    export let elements = [];
    export let sort = () => {};
    export let currentSort = null;
    export let sortDirection = null;

    const getProjectName = subvention => {
        if (!subvention.actions_proposee || !subvention.actions_proposee.length) return;

        const names = subvention.actions_proposee
            .sort((actionA, actionB) => actionA.rang - actionB.rang)
            .map(action => `${helpers.capitalizeFirstLetter(action.intitule)}.`.replace("..", "."));

        // Remove duplicates
        return [...new Set(names)].join("-");
    };
</script>

<Table>
    <svelte:fragment slot="colgroup">
        <colgroup>
            <col class="col-120" />
            <col class="col-80" />
            <col class="col-80" />
            <col />
            <col class="col-80" />
            <col class="col-120" />
            <col class="col-120" />
        </colgroup>
    </svelte:fragment>
    <svelte:fragment slot="head">
        <TableHead
            action={() => sort("subvention.service_instructeur")}
            actionActive={currentSort === "subvention.service_instructeur"}
            actionDirection={sortDirection}>
            À qui a été adressé la demande ?
        </TableHead>
        <TableHead
            action={() => sort("subvention.date_commision")}
            actionActive={currentSort === "subvention.date_commision"}
            actionDirection={sortDirection}>
            À quelle date ?
        </TableHead>
        <TableHead
            action={() => sort("subvention.dispositif")}
            actionActive={currentSort === "subvention.dispositif"}
            actionDirection={sortDirection}>
            Pour quel dispositif ?
        </TableHead>
        <TableHead
            action={() => sort("subvention.project-name")}
            actionActive={currentSort === "subvention.project-name"}
            actionDirection={sortDirection}>
            Pour quel projet la demande a-t-elle été faite ?
        </TableHead>
        <TableHead>Plus d'infos</TableHead>
        <TableHead
            action={() => sort("subvention.montants.demande")}
            actionActive={currentSort === "subvention.montants.demande"}
            actionDirection={sortDirection}>
            Quel montant demandé ?
        </TableHead>
        <TableHead
            action={() => sort("subvention.montants.accorde")}
            actionActive={currentSort === "subvention.montants.accorde"}
            actionDirection={sortDirection}>
            Quel montant accordé ?
        </TableHead>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each elements as element}
            <tr>
                {#if !element.subvention}
                    <TableCell colspan="6" position="center" overflow="visible">
                        <div class="tooltip-wrapper-2">
                            <span class="tooltip">Fonctionnalité en cours de développement</span>
                            <Button disabled="true" icon="information-line" iconPosition="right">
                                Je cherche d'avantage d'informations sur cette demande
                            </Button>
                        </div>
                    </TableCell>
                    <TableCell primary={true} position="end">?</TableCell>
                {:else}
                    <TableCell>{element.subvention.service_instructeur}</TableCell>
                    <TableCell position="center">
                        {#if element.subvention.date_commision}
                            {@html breakDateYear(new Date(element.subvention.date_commision).toLocaleDateString())}
                        {:else}
                            {valueOrHyphen()}
                        {/if}
                    </TableCell>
                    <TableCell>{valueOrHyphen(element.subvention.dispositif)}</TableCell>
                    <TableCell
                        position={valueOrHyphen(getProjectName(element.subvention)) === "-" ? "center" : "start"}>
                        {valueOrHyphen(getProjectName(element.subvention))}
                    </TableCell>
                    <TableCell position="center" overflow="visible">
                        <div class="tooltip-wrapper">
                            <span class="tooltip">Fonctionnalité en cours de développement</span>
                            <Button disabled="true" icon="information-line" />
                        </div>
                    </TableCell>
                    <TableCell position="end">
                        {valueOrHyphen(numberToEuro(element.subvention.montants?.demande))}
                    </TableCell>
                    <TableCell primary={true} position="end">
                        {#if element.subvention.montants?.accorde}
                            {numberToEuro(element.subvention.montants?.accorde)}
                        {:else}
                            {element.subvention.status}
                        {/if}
                    </TableCell>
                {/if}
            </tr>
        {/each}
    </svelte:fragment>
</Table>

<style>
    /* This is a quick fix and if needed a Tooltip component should be made */
    .tooltip-wrapper,
    .tooltip-wrapper-2 {
        position: relative;
    }

    .tooltip-wrapper .tooltip {
        top: -40px;
        left: -134px;
    }

    .tooltip-wrapper-2 .tooltip {
        top: -40px;
        left: 100px;
    }

    .tooltip {
        display: none;
        position: absolute;
        color: #fff;
        background-color: #555;
        padding: 5px;
        border-radius: 6px;
        white-space: nowrap;
    }

    .tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    .tooltip-wrapper:hover > span.tooltip,
    .tooltip-wrapper-2:hover > span.tooltip {
        display: block;
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

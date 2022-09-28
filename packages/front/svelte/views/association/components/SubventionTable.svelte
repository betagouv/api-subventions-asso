<script>
    import TableCell from "../../../components/TableCell.svelte";
    import TableHead from "../../../components/TableHead.svelte";
    import Button from "../../../dsfr/Button.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import { valueOrHyphen, numberToEuro } from "../../../helpers/dataHelper";
    import { withTwoDigitYear } from "../../../helpers/dateHelper";
    import helpers from "../../../../src/shared/helpers/EJSHelper";
    import SubventionInfoModal from "./SubventionInfoModal.svelte";
    import { modal, data } from "../../../store/modal.store";

    export let elements = [];
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    export let sort = () => {};
    export let currentSort = null;
    export let sortDirection = null;

    const displayModal = subvention => {
        data.update(() => ({ subvention }));
        modal.update(() => SubventionInfoModal);
    };


    const trim = (str, length) => {
        if (str.length > length) {
            return str.slice(0, length - 3) + "...";
        } else return str;
    };

    const getProjectName = subvention => {
        if (!subvention.actions_proposee || !subvention.actions_proposee.length) return;

        let names = subvention.actions_proposee
            .sort((actionA, actionB) => actionA.rang - actionB.rang)
            .map(action => `${helpers.capitalizeFirstLetter(action.intitule)}.`.replace("..", "."));

        // Remove duplicates
        names = [...new Set(names)].join("-");

        names = trim(names, 43);

        return names;
    };
</script>

<Table>
    <svelte:fragment slot="colgroup">
        <colgroup>
            <col class="col-120" />
            <col />
            <col class="col-100" />
            <col />
            <col class="col-80" />
            <col class="col-100" />
            <col class="col-100" />
        </colgroup>
    </svelte:fragment>
    <svelte:fragment slot="head">
        <TableHead
            action={() => sort("subvention.service_instructeur")}
            actionActive={currentSort === "subvention.service_instructeur"}
            actionDirection={sortDirection}>
            Service instructeur
        </TableHead>
        <TableHead
            action={() => sort("subvention.date_commision")}
            actionActive={currentSort === "subvention.date_commision"}
            actionDirection={sortDirection}>
            <p>Date de commission</p>
        </TableHead>
        <TableHead
            action={() => sort("subvention.dispositif")}
            actionActive={currentSort === "subvention.dispositif"}
            actionDirection={sortDirection}>
            Dispositif
        </TableHead>
        <TableHead
            action={() => sort("subvention.project-name")}
            actionActive={currentSort === "subvention.project-name"}
            actionDirection={sortDirection}>
            Intitulé de l'action
        </TableHead>
        <TableHead>Plus d'infos</TableHead>
        <TableHead
            action={() => sort("subvention.montants.demande")}
            actionActive={currentSort === "subvention.montants.demande"}
            actionDirection={sortDirection}>
            Montant demandé
        </TableHead>
        <TableHead
            action={() => sort("subvention.montants.accorde")}
            actionActive={currentSort === "subvention.montants.accorde"}
            actionDirection={sortDirection}>
            Montant accordé
        </TableHead>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each elements as element}
            <tr>
                {#if !element.subvention}
                    <TableCell colspan="6" position="center">
                        Nous ne disposons pas encore de cette information
                    </TableCell>
                    <TableCell primary={true} position="end">?</TableCell>
                {:else}
                    <TableCell>{trim(element.subvention.service_instructeur, 35)}</TableCell>
                    <TableCell position="center">
                        {#if element.subvention.date_commision}
                            {withTwoDigitYear(new Date(element.subvention.date_commision))}
                        {:else}
                            {valueOrHyphen()}
                        {/if}
                    </TableCell>
                    <TableCell>
                        {valueOrHyphen(element.subvention.dispositif)}
                    </TableCell>
                    <TableCell
                        position={valueOrHyphen(getProjectName(element.subvention)) === "-" ? "center" : "start"}>
                        {valueOrHyphen(getProjectName(element.subvention))}
                    </TableCell>
                    <TableCell position="center" overflow="visible">
                        {#if element.subvention.actions_proposee?.length}
                            <Button
                                icon="information-line"
                                ariaControls="fr-modal"
                                on:click={() => displayModal(element.subvention)} />
                        {:else}
                            <div class="tooltip-wrapper">
                                <span class="tooltip">Nous ne disposons pas de plus d'informations</span>
                                <Button disabled="true" icon="information-line" />
                            </div>
                        {/if}
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
    .tooltip-wrapper {
        position: relative;
    }

    .tooltip-wrapper .tooltip {
        top: -40px;
        left: -139px;
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

    .tooltip-wrapper:hover > span.tooltip {
        display: block;
    }

    .col-120 {
        width: 120px;
        max-width: 120px;
    }

    .col-100 {
        width: 100px;
        max-width: 100px;
    }

    .col-80 {
        width: 80px;
        max-width: 80px;
    }
</style>

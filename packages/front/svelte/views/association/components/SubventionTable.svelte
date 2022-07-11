<script>
    import TableCell from "../../../components/TableCell.svelte";
    import TableHead from "../../../components/TableHead.svelte";
    import Button from "../../../dsfr/Button.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import { valueOrHyphen, numberToEuro } from "../../../helpers/dataHelper";
    import { breakDateYear } from "../../../helpers/dateHelper";
    import helpers from "../../../../src/shared/helpers/EJSHelper";

    export let elements = [];

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
        <TableHead action={() => console.log("filter")}>À qui a été adressé la demande ?</TableHead>
        <TableHead action={() => console.log("filter")}>À quelle date ?</TableHead>
        <TableHead action={() => console.log("filter")}>Pour quel dispositif ?</TableHead>
        <TableHead action={() => console.log("filter")}>Pour quel projet la demande a-t-elle été faite ?</TableHead>
        <TableHead>Plus d'infos</TableHead>
        <TableHead action={() => console.log("filter")}>Quel montant demandé ?</TableHead>
        <TableHead action={() => console.log("filter")}>Quel montant accordé ?</TableHead>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each elements as element}
            <tr>
                {#if !element.subvention}
                    <TableCell colspan="6" position="center">
                        <Button
                            disabled="true"
                            icon="information-line"
                            iconPosition="right"
                            tooltip="Fonctionnalités en cours de développement">
                            Je cherche d'avantage d'informations sur cette demande
                        </Button>
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
                    <TableCell position="center">
                        <Button
                            disabled="true"
                            icon="information-line"
                            tooltip="Fonctionnalités en cours de développement" />
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
    .col-120 {
        width: 120px;
        max-width: 120px;
    }

    .col-80 {
        width: 80px;
        max-width: 80px;
    }
</style>

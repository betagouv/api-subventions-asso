<script>
    import TableCell from "../../../components/TableCell.svelte";
    import TableHead from "../../../components/TableHead.svelte";
    import Button from "../../../dsfr/Button.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import { valueOrHyphen, numberToEuro } from "../../../helpers/dataHelper";
    import helpers from "../../../../src/shared/helpers/EJSHelper";

    export let elements = [];

    const getProjectName = subvention => {
        if (!subvention.actions_proposee || !subvention.actions_proposee.length) return;

        return subvention.actions_proposee
            .sort((actionA, actionB) => actionA.rang - actionB.rang)
            .map(action => `${helpers.capitalizeFirstLetter(action.intitule)}.`.replace("..", "."))
            .join("-");
    };
</script>

<Table>
    <svelte:fragment slot="head">
        <TableHead action={() => console.log("filter")}>À qui a été adressé la demande ?</TableHead>
        <TableHead action={() => console.log("filter")}>À quelle date ?</TableHead>
        <TableHead action={() => console.log("filter")}>Pour quel dispositif la demande a-t-elle été faite ?</TableHead>
        <TableHead action={() => console.log("filter")}>Pour quel projet la demande a-t-elle été faite ?</TableHead>
        <TableHead>Plus d'infos</TableHead>
        <TableHead action={() => console.log("filter")}>Quel montant demandé ?</TableHead>
        <TableHead action={() => console.log("filter")}>Quel montant accordé ?</TableHead>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each elements as element}
            <tr>
                {#if !element.subvention}
                    <TableCell colspan="6" class="button-cell">
                        <Button
                            disabled="true"
                            icon="information-line"
                            iconPosition="right"
                            tooltip="Fonctionnalités en cours de développement">
                            Je cherche d'avantage d'informations sur cette demande
                        </Button>
                    </TableCell>
                    <TableCell primary={true}>?</TableCell>
                {:else}
                    <TableCell>{element.subvention.service_instructeur}</TableCell>
                    <TableCell>
                        {#if element.subvention.date_commision}
                            {new Date(element.subvention.date_commision).toLocaleDateString()}
                        {:else}
                            {valueOrHyphen()}
                        {/if}
                    </TableCell>
                    <TableCell>{valueOrHyphen(element.subvention.dispositif)}</TableCell>
                    <TableCell>
                        {valueOrHyphen(getProjectName(element.subvention))}
                    </TableCell>
                    <TableCell position="center">
                        <Button
                            disabled="true"
                            icon="information-line"
                            tooltip="Fonctionnalités en cours de développement" />
                    </TableCell>
                    <TableCell>{valueOrHyphen(numberToEuro(element.subvention.montants?.demande))}</TableCell>
                    <TableCell primary={true}>
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
</style>

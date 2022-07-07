<script>
    import TableCell from "../../../components/TableCell.svelte";

    import Button from "../../../dsfr/Button.svelte";
    import Table from "../../../dsfr/Table.svelte";
    import { valueOrHyphen, numberToEuro } from "../../../helpers/dataHelper";
    import helpers from "../../../../src/shared/helpers/EJSHelper";

    export let elements = [];

    const getProjectName = subvention => {
        if (!subvention.actions_proposee || !subvention.actions_proposee.length) return;

        return subvention.actions_proposee
            .sort((actionA, actionB) => actionA.rang - actionB.rang)
            .map(action => `${helpers.capitalizeFirstLetter(action.intitule)}.`.replace("..", "."));
    };

    console.log(elements);
</script>

<Table>
    <svelte:fragment slot="head">
        <th scope="col">À qui a été adressé la demande ?</th>
        <th scope="col">À quelle date ?</th>
        <th scope="col">Pour quel dispositif la demande a-t-elle été faite ?</th>
        <th scope="col">Pour quel projet la demande a-t-elle été faite ?</th>
        <th scope="col">Plus d'infos</th>
        <th scope="col">Quel montant demandé ?</th>
        <th scope="col">Quel montant accordé ?</th>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each elements as element}
            <tr>
                {#if !element.subvention}
                    <td colspan="7">
                        <Button disabled="true" icon="information-line" iconPosition="right">
                            Je cherche d'avantage d'informations sur cette demande
                        </Button>
                    </td>
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
                        {#if getProjectName(element.subvention) && getProjectName(element.subvention).length}
                            {#each getProjectName(element.subvention) as label}
                                <p>{label}</p>
                            {/each}
                        {:else}
                            {valueOrHyphen()}
                        {/if}
                    </TableCell>
                    <TableCell>
                        <Button disabled="true" icon="information-line">
                            Je cherche d'avantage d'informations sur cette demande
                        </Button>
                    </TableCell>
                    <TableCell>{valueOrHyphen(numberToEuro(element.subvention.montants?.demande))}</TableCell>
                    <TableCell primary="true">
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

<script>
    import { InfosBancairesEtabController } from "./InfosBancairesEtab.Controller";
    import Table from "../../../dsfr/Table.svelte";
    import Button from "../../../dsfr/Button.svelte";

    export let elements = []; // informations_bancaires
    const controller = new InfosBancairesEtabController(elements);
    const { infosBancaires } = controller;
</script>

<Table title="Informations bancaires">
    <svelte:fragment slot="head">
        <td>BIC</td>
        <td>IBAN</td>
        <td>Date de dépôt</td>
        <td>RIB</td>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each $infosBancaires as element}
            <tr>
                <td>{element.bic}</td>
                <td>{element.iban}</td>
                <td>{element.date}</td>
                <td>
                    <Button type="tertiary" icon="fr-icon-download-line" disabled="true" />
                </td>
            </tr>
        {/each}
    </svelte:fragment>
</Table>

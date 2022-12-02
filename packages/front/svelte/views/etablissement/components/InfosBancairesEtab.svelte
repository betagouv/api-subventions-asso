<script>
    import { InfosBancairesEtabController } from "./InfosBancairesEtab.Controller";
    import Table from "../../../dsfr/Table.svelte";

    export let elements = []; // informations_bancaires

    const controller = new InfosBancairesEtabController(elements);
    const { infosBancaires } = controller;
</script>

<h2>Informations bancaires</h2>

<Table title="Informations bancaires">
    <svelte:fragment slot="head">
        <td>BIC</td>
        <td>IBAN</td>
        <td>Date de dépôt</td>
        <td>Source de dépôt</td>
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each $infosBancaires as element}
            <tr>
                <td>{element.bic}</td>
                <td>{element.iban}</td>
                <td>{element.date}</td>
                <td>{element.provider}</td>
            </tr>
        {/each}
    </svelte:fragment>
</Table>

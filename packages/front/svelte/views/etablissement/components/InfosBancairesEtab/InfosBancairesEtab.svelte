<script>
    import Table from "../../../../dsfr/Table.svelte";
    import { InfosBancairesEtabController } from "./InfosBancairesEtab.controller";

    export let elements; // informations_bancaires

    const controller = new InfosBancairesEtabController(elements);
    const { infosBancaires, headers } = controller;
</script>

<h2>Informations bancaires</h2>

<Table title="Informations bancaires">
    <svelte:fragment slot="colgroup">
        <colgroup>
            <col class="col-8" />
            <col class="col-15" />
            <col class="col-10" />
            <col class="col-10" />
        </colgroup>
    </svelte:fragment>
    <svelte:fragment slot="head">
        {#each headers as title}
            <td>{title}</td>
        {/each}
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each infosBancaires as element}
            <tr>
                <td>{element.bic}</td>
                <td>{element.iban}</td>
                <td>{element.date}</td>
                <td>{element.provider}</td>
            </tr>
        {/each}
    </svelte:fragment>
</Table>

<style>
    .col-8 {
        width: 8em;
    }

    .col-15 {
        width: 15em;
    }

    .col-10 {
        width: 10em;
    }
</style>

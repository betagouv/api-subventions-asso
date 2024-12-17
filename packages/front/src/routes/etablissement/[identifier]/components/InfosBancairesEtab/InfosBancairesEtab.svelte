<script>
    import { InfosBancairesEtabController } from "./InfosBancairesEtab.controller";
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";

    export let elements; // informations_bancaires

    const tableId = "infos-bancaires-etab";

    const controller = new InfosBancairesEtabController(elements);
    const { infosBancaires, headers } = controller;
</script>

<h2>Informations bancaires</h2>
{#if controller.hasInfo}
    <div class="fr-grid-row">
        <div class="fr-col-12">
            <!-- TODO: scrollable make it spread width, investigate why scrollable={false} make it not -->
            <Table
                id={tableId}
                {headers}
                headersSize={["md", "lg", "md", "md"]}
                bordered={false}
                title="Informations bancaires">
                {#each infosBancaires as element, index}
                    <TableRow id={tableId} {index}>
                        <td>{element.bic}</td>
                        <td>{element.iban}</td>
                        <td>{element.date}</td>
                        <td>{element.provider}</td>
                    </TableRow>
                {/each}
            </Table>
        </div>
    </div>
{:else}
    <p>Nous sommes désolés, nous n'avons trouvé aucune donnée pour cet établissement</p>
{/if}

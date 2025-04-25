<script lang="ts">
    import type { AmountsVsProgramRegionDto } from "dto";
    import { TableAmountsVsProgramRegionController } from "./TableAmountsVsProgramRegion.controller";
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";

    export let elements: AmountsVsProgramRegionDto[]; // amountsVsProgramRegion

    const tableId = "table-amounts-vs-program-region";

    const controller = new TableAmountsVsProgramRegionController(elements);

    const { checkboxOptions, selectedColumns, groupedData, headers } = controller;
</script>

<Checkbox
    bind:value={$selectedColumns}
    id="checkboxId"
    label="Ajouter ou éliminer des colonnes"
    inline={true}
    options={checkboxOptions} />
<div class="scrollable-container">
    <div class="fr-grid-row">
        <div class="fr-col">
            <Table
                id={tableId}
                headers={$headers}
                headersSize={["sm", "sm", "sm", "sm"]}
                bordered={false}
                scrollable={false}
                hideTitle={true}
                title="Montant des subventions que l'Etat a versé">
                {#each $groupedData as row, index (index)}
                    <TableRow id={tableId} {index}>
                        <td>{row.exerciceBudgetaire}</td>
                        {#each $selectedColumns as col, index (index)}
                            <td>{row[col]}</td>
                        {/each}
                        <td>{row.montant}</td>
                    </TableRow>
                {/each}
            </Table>
        </div>
    </div>
</div>

<style>
    .scrollable-container {
        max-height: 500px;
        overflow-y: auto;
    }
</style>

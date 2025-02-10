<script>
    import { TableAmountsVsProgramRegionController } from "./TableAmountsVsProgramRegion.controller";
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";

    export let elements; // amountsVsProgramRegion

    const tableId = "table-amounts-vs-program-region";
    let value = ["regionAttachementComptable", "programme"];


    const controller = new TableAmountsVsProgramRegionController();

    $: headers = ["Exercice", ...value.map(col=>controller.headersDict[col]), "Montant"];
    $: groupedData = controller.getTableData(elements, value);

</script>
    <Checkbox 
    bind:value
    id=checkboxId
    label="Ajouter ou eliminer des colonnes" 
    inline=true
    options={[
        {label: "Attachement Comptable", value: "regionAttachementComptable"},
        {label: "Programme", value: "programme"}
    ]}/>
    <div class="scrollable-container">
    <div class="fr-grid-row">
        <div class="fr-col-2">
            <Table
                id={tableId}
                headers = {headers}
                headersSize={["sm", "md", "md", "sm"]}
                bordered={false}
                scrollable={false}
                hideTitle={true}
                title="Montant des subventions que l'Etat a versé">
                {#each groupedData as row, index}
                    <TableRow id={tableId} {index}>
                        <td>{row.exerciceBudgetaire}</td>
                        {#each value as col}
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
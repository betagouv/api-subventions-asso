<script>
    // your script goes here

    import Table from "../../dsfr/Table.svelte";
</script>

<Table color="green-emeraude">
    <svelte:fragment slot="head">
        <th>Test</th>
        <th>Test</th>
        <th>Test</th>
    </svelte:fragment>
    <svelte:fragment slot="body">
        <tr>
            <td>Test</td>
            <td>Test</td>
            <td>Test</td>
        </tr>
    </svelte:fragment>
</Table>

<style>
    /* your styles go here */
</style>

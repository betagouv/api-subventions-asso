<script>
    import Alert from "../../dsfr/Alert.svelte";
    import ModalContent from "../../dsfr/ModalContent.svelte";
    import Table from "../../dsfr/Table.svelte";
</script>

<ModalContent title="Détail des informations recueillies">
    <Alert>Certaines formulations peuvent différer selon les fournisseurs de données</Alert>
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
</ModalContent>

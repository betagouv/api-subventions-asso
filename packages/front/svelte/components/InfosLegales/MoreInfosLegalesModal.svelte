<script>
    import { data } from "../../store/modal.store";

    import Alert from "../../dsfr/Alert.svelte";
    import ModalContent from "../../dsfr/ModalContent.svelte";
    import Table from "../../dsfr/Table.svelte";
</script>

<ModalContent title="Détail des informations recueillies">
    <Alert small={true}>Certaines formulations peuvent différer selon les fournisseurs de données</Alert>
    <Table color="blue-cumulus">
        <svelte:fragment slot="head">
            {#each $data.headers as header}
                <th>{header}</th>
            {/each}
        </svelte:fragment>
        <svelte:fragment slot="body">
            {#each $data.rows as row}
                <tr>
                    {#each row as cell}
                        <td>{cell}</td>
                    {/each}
                </tr>
            {/each}
        </svelte:fragment>
    </Table>
</ModalContent>

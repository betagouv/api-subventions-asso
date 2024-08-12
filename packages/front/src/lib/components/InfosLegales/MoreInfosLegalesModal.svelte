<script lang="ts">
    import { data } from "$lib/store/modal.store";

    import Alert from "$lib/dsfr/Alert.svelte";
    import ModalContent from "$lib/dsfr/ModalContent.svelte";
    import Table from "$lib/dsfr/Table.svelte";
</script>

<ModalContent title="Détail des informations recueillies">
    <Alert small={true}>Certaines formulations peuvent différer selon les fournisseurs de données</Alert>
    <Table multiline={true}>
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

<script lang="ts">
    import { data } from "$lib/store/modal.store";
    import Table from "$lib/dsfr/Table.svelte";

    import Alert from "$lib/dsfr/Alert.svelte";
    import ModalContent from "$lib/dsfr/ModalContent.svelte";
</script>

<ModalContent title="Détail des informations recueillies">
    <Alert small={true}>Certaines formulations peuvent différer selon les fournisseurs de données</Alert>
    {"" + /* @ts-expect-error -- $data has unknown type */ +""}
    <Table hideTitle={true} headers={$data.headers} rows={$data.rows} bordered={false} scrollable={false} />
</ModalContent>

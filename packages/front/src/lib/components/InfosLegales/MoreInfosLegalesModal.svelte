<script lang="ts">
    import type Store from "$lib/core/Store";
    import { data } from "$lib/store/modal.store";
    import Table from "$lib/dsfr/Table.svelte";

    import Alert from "$lib/dsfr/Alert.svelte";
    import ModalContent from "$lib/dsfr/ModalContent.svelte";
    const dataWithType = data as unknown as Store<{
        headers: string[];
        rows: string[][];
    }>;
</script>

<ModalContent title="Détail des informations recueillies">
    <Alert small={true}>Certaines formulations peuvent différer selon les fournisseurs de données</Alert>
    <Table
        hideTitle={true}
        headers={$dataWithType.headers}
        rows={$dataWithType.rows}
        bordered={false}
        scrollable={false} />
</ModalContent>

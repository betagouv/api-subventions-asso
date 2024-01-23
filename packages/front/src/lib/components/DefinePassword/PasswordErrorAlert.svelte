<script lang="ts">
    import PasswordErrorAlertController from "./PasswordErrorAlert.controller";
    import Alert from "$lib/dsfr/Alert.svelte";

    export let error: { data?: { code: string } };
    const ctrl = new PasswordErrorAlertController(error);
</script>

{#if error}
    <Alert title="Attention" type="warning">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html ctrl.errorMessage}
    </Alert>
{/if}

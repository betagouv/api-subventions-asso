<script>
    import PasswordErrorAlertController from "./PasswordErrorAlert.controller";
    import Alert from "@dsfr/Alert.svelte";

    export let error;

    const ctrl = new PasswordErrorAlertController(error);
</script>

{#if error}
    <Alert title="Attention" type="warning">
        {@html ctrl.errorMessage}
    </Alert>
{/if}

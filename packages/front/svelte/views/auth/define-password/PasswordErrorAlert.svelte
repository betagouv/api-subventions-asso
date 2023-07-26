<script>
    import PasswordErrorAlertController from "./PasswordErrorAlert.controller";
    import Alert from "@dsfr/Alert.svelte";

    export let error;

    const ctrl = PasswordErrorAlertController(error);
</script>

{error}

{#if error}
    <Alert title="Attention" type="warning">
        {@html ctrl.errorMessage()}
    </Alert>
{/if}

<!-- markup (zero or more items) goes here -->
<style>
    /* your styles go here */
</style>

<script>
    import Alert from "$lib/dsfr/Alert.svelte";

    export let message;
</script>

<Alert type="error" title="Une erreur est survenue">
    {message}
</Alert>

<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";

    let { message } = $props();
</script>

<Alert type="error" title="Une erreur est survenue">
    {message}
</Alert>

<script>
    import Input from "@dsfr/Input.svelte";

    export let values = {
        email: "",
    };
</script>

<fieldset>
    <Input label="Email" bind:value={values.email} />
</fieldset>

<style>
</style>

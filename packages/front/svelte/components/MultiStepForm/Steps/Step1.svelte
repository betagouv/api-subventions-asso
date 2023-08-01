<script>
    import Input from "@dsfr/Input.svelte";

    export let values = {
        firstname: "",
        lastname: "",
    };
</script>

<fieldset>
    <Input label="Firstname" bind:value={values.firstname} />
    <Input label="Lastname" bind:value={values.lastname} />
</fieldset>

<style>
</style>

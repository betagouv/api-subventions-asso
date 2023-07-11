<script>
    import Input from "@dsfr/Input.svelte";

    export let values = {
        firstname: "",
        lastname: "",
    };
</script>

{Object.values(values)}
<Input label="Firstname" bind:value={values.firstname} />
<Input label="Lastname" bind:value={values.lastname} />

<style>
</style>

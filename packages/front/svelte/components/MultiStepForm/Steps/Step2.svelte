<script>
    import Input from "@dsfr/Input.svelte";

    export let values = {
        email: "",
    };
</script>

{Object.values(values)}
<Input label="Email" bind:value={values.email} />

<style>
</style>

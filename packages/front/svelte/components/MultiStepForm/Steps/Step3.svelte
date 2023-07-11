<script>
    import Input from "@dsfr/Input.svelte";

    export let values = {
        password: "",
        confirm: "",
    };
</script>

{Object.values(values)}
<Input label="Password" type="password" bind:value={values.password} />
<Input label="Confirm" type="password" bind:value={values.confirm} />

<style>
</style>

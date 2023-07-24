<script>
    import Input from "@dsfr/Input.svelte";

    export let values = {
        password: "",
        confirm: "",
    };
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <Input label="Mot de passe" bind:value={values.password} required={true} type="password" />
    </div>
    <div class="fr-fieldset__element">
        <Input label="Confirmation de mot de passe" bind:value={values.confirm} required={true} type="password" />
    </div>
</fieldset>

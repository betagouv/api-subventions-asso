<script>
    import DefinePasswordController from "./DefinePassword.controller";
    import PasswordInput from "$lib/dsfr/PasswordInput.svelte";

    export let values = {
        password: "",
        confirmPwd: "",
    };

    const controller = new DefinePasswordController(values);
    const { passwordErrorMsg, showPasswordError, confirmErrorMsg, showConfirmError } = controller;

    $: values.password, controller.validatePassword();
    $: values.confirmPwd, controller.checkConfirm();
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <PasswordInput
            label="Mot de passe"
            bind:value={values.password}
            error={$showPasswordError}
            errorMsg={$showPasswordError ? passwordErrorMsg : undefined} />
    </div>
    <div class="fr-fieldset__element">
        <PasswordInput
            label="Confirmation de mot de passe"
            bind:value={values.confirmPwd}
            error={$showConfirmError}
            errorMsg={$showConfirmError ? confirmErrorMsg : undefined} />
    </div>
</fieldset>

<script lang="ts">
    import DefinePasswordController from "./DefinePassword.controller";
    import PasswordInput from "$lib/dsfr/PasswordInput.svelte";

    export let values = { password: "", confirmPwd: "" };

    const controller = new DefinePasswordController(values);
    const { passwordErrorMsg, showPasswordError, confirmPwdErrorMsg, showConfirmError } = controller;

    // TODO: #3374
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    $: values.password, controller.validatePassword();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    $: values.confirmPwd, controller.checkConfirm();
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <PasswordInput
            label="Mot de passe"
            bind:value={values.password}
            error={$showPasswordError}
            errorMsg={$showPasswordError ? passwordErrorMsg : null} />
    </div>
    <div class="fr-fieldset__element">
        <PasswordInput
            label="Confirmation de mot de passe"
            bind:value={values.confirmPwd}
            error={$showConfirmError}
            errorMsg={$showConfirmError ? confirmPwdErrorMsg : null} />
    </div>
</fieldset>

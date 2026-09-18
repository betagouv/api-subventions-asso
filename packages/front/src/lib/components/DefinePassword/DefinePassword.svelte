<script lang="ts">
    import DefinePasswordController from "./DefinePassword.controller";
    import PasswordInput from "$lib/dsfr/PasswordInput.svelte";

    let { values = $bindable({ password: "", confirmPwd: "" }), onerror = () => {}, onvalid = () => {} } = $props();

    const controller = new DefinePasswordController(values, event => (event === "error" ? onerror() : onvalid()));
    const { passwordErrorMsg, showPasswordError, confirmPwdErrorMsg, showConfirmError } = controller;

    $effect(() => {
        void values.password;
        controller.validatePassword();
    });

    $effect(() => {
        void values.confirmPwd;
        controller.checkConfirm();
    });
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

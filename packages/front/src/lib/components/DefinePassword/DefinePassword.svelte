<script lang="ts">
    import DefinePasswordController from "./DefinePassword.controller";
    import PasswordInput from "$lib/dsfr/PasswordInput.svelte";

    let { values = $bindable({ password: "", confirmPwd: "" }), onerror = () => {}, onvalid = () => {} } = $props();

    const controller = new DefinePasswordController(values, event => (event === "error" ? onerror() : onvalid()));
    const { passwordErrorMsg, showPasswordError, confirmPwdErrorMsg, showConfirmError } = controller;
    let password = $derived(values.password);
    let confirmPwd = $derived(values.confirmPwd);

    function getInputValue(event: Event) {
        return event.currentTarget instanceof HTMLInputElement ? event.currentTarget.value : "";
    }

    function updatePassword(event: Event) {
        password = getInputValue(event);
        values.password = password;
        controller.validatePassword();
    }

    function updateConfirmPwd(event: Event) {
        confirmPwd = getInputValue(event);
        values.confirmPwd = confirmPwd;
        controller.checkConfirm();
    }
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <PasswordInput
            label="Mot de passe"
            bind:value={password}
            oninput={updatePassword}
            error={$showPasswordError}
            errorMsg={$showPasswordError ? passwordErrorMsg : null} />
    </div>
    <div class="fr-fieldset__element">
        <PasswordInput
            label="Confirmation de mot de passe"
            bind:value={confirmPwd}
            oninput={updateConfirmPwd}
            error={$showConfirmError}
            errorMsg={$showConfirmError ? confirmPwdErrorMsg : null} />
    </div>
</fieldset>

<script>
    import Alert from "../../../dsfr/Alert.svelte";
    import LoginController from "./Login.controller";
    import Input from "@dsfr/Input.svelte";
    import Button from "@dsfr/Button.svelte";
    import PasswordInput from "@dsfr/PasswordInput.svelte";

    let form;
    export let query;
    const controller = new LoginController(query);

    const { error, showSuccessMessage, successMessage } = controller;
    $: controller.formElt = form;
</script>

<h1 class="fr-mb-6w fr-h2">
    {controller.pageTitle}
</h1>
{#if $error != null}
    <Alert title="Attention">
        {$error}
    </Alert>
{/if}
{#if showSuccessMessage}
    <Alert type="success">
        {successMessage}
    </Alert>
{/if}
<div class="login fr-col-6 fr-col-offset-3 fr-p-8v fr-mt-12v">
    <form on:submit|preventDefault={() => controller.submit()}>
        <fieldset class="fr-fieldset fr-mb-5w">
            <legend class="fr-fieldset__legend fr-h5" id="login-legend">Se connecter à son compte</legend>
            <div class="fr-fieldset__element fr-mt-4v">
                <Input
                    id="email-input"
                    type="email"
                    label="Email professionnel"
                    autocomplete="email"
                    bind:value={controller.email}
                    required={true} />
            </div>
            <div class="fr-fieldset__element fr-mt-4v">
                <PasswordInput label="Mot de passe" bind:value={controller.password} />
                <p>
                    <a href={controller.forgetPasswordUrl} class="fr-link">Mot de passe oublié ?</a>
                </p>
            </div>

            <div class="fr-fieldset__element fr-mt-4v">
                <ul class="fr-btns-group">
                    <li>
                        <Button title="Se connecter" htmlType="submit">Se connecter</Button>
                    </li>
                </ul>
            </div>
        </fieldset>
    </form>
    <div class="separator" />
    <form on:submit|preventDefault={() => controller.signup()}>
        <fieldset class="fr-fieldset fr-mt-3w fr-mb-5w">
            <legend class="fr-fieldset__legend fr-h5" id="signup">Vous n'avez pas de compte ?</legend>
            <div class="fr-fieldset__element">
                <ul class="fr-btns-group">
                    <li>
                        <Button type="secondary" title="Se connecter" htmlType="submit">Créer un compte</Button>
                    </li>
                </ul>
            </div>
        </fieldset>
    </form>
</div>

<style>
    .login {
        border: 2px solid var(--border-default-grey);
    }

    .separator {
        width: 100%;
        border-top: 2px solid var(--border-default-grey);
    }
</style>

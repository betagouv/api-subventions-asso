<script>
    import { PUBLIC_DATASUB_URL } from "$env/static/public";
    import AgentConnectButton from "$lib/dsfr/AgentConnectButton.svelte";
    import { onMount } from "svelte";
    import LoginController from "./Login.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import PasswordInput from "$lib/dsfr/PasswordInput.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";

    let form;
    let alertElement;
    export let data;
    const { query } = data;

    const alertMsg =
        "Data.subvention étant réservé aux agents publics, il est nécessaire d'être doté d'une adresse e-mail professionnelle du service public ou d'utiliser le service ProConnect.";

    const controller = new LoginController(query);

    const { error, showSuccessMessage, successMessage } = controller;
    onMount(() => controller.onMount(alertElement));
    $: controller.formElt = form;
</script>

<h1 class="fr-mb-6w fr-h2">
    {controller.pageTitle}
</h1>
<Alert type="info" title={alertMsg}></Alert>

<div bind:this={alertElement}>
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
</div>

<div class="login-container fr-col-8 fr-col-offset-2 fr-py-4w fr-px-6w fr-mt-6w">
    <h2 class="fr-h4 center">Utilisez ProConnect pour créer un nouveau compte ou accéder à votre espace</h2>
    <div class="fr-grid-row">
        <div class="fr-col-10 fr-col-offset-1 center">
            <p class="center">
                <b>
                    ProConnect vous permet d’accéder à de nombreux services en ligne en utilisant l’un de vos comptes
                    professionnels existants.
                </b>
            </p>
            <AgentConnectButton link={PUBLIC_DATASUB_URL + `/auth/ac/login`} />
        </div>
    </div>
    <div class="fr-grid-row fr-my-4w">
        <div class="text-separator" />
    </div>
    <form on:submit|preventDefault={() => controller.submit()}>
        <fieldset class="fr-fieldset">
            <legend class="fr-fieldset__legend fr-h5 text-center" id="login-legend">
                Connectez-vous avec vos identifiants habituels <br />
                (si vous n'avez pas encore basculé sur ProConnect)
            </legend>
            <div class="fr-fieldset__element fr-mt-2v">
                <Input
                    id="email-input"
                    type="email"
                    label="Email"
                    autocomplete="email"
                    bind:value={controller.email}
                    required={true} />
            </div>
            <div class="fr-fieldset__element fr-mt-2v">
                <PasswordInput
                    label="Mot de passe"
                    bind:value={controller.password}
                    forgetPasswordUrl={controller.forgetPasswordUrl} />
            </div>

            <div class="fr-fieldset__element fr-mt-2v">
                <ul class="fr-btns-group">
                    <li>
                        <Button title="Se connecter" htmlType="submit" trackerName="login.form.submit">
                            Se connecter
                        </Button>
                    </li>
                </ul>
            </div>
        </fieldset>
    </form>
</div>

<style>
    .login-container {
        border: 1px solid var(--border-default-grey);
    }

    .text-separator {
        width: 100%;
        flex-shrink: 1;
        border-top: 1px solid var(--border-default-grey);
        margin-top: auto;
        margin-bottom: auto;
        height: 0;
    }

    .center {
        text-align: center;
    }
</style>

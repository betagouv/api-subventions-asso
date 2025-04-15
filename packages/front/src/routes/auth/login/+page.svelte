<script>
    import { onMount } from "svelte";
    import LoginController from "./Login.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import PasswordInput from "$lib/dsfr/PasswordInput.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import AgentConnectZone from "$lib/components/AgentConnectZone.svelte";

    let form;
    let alertElement;
    export let data;
    const { query } = data;
    const controller = new LoginController(query);

    const { error, showSuccessMessage, successMessage } = controller;
    onMount(() => controller.onMount(alertElement));
    $: controller.formElt = form;

    // TODO intégrer nouvelle page
</script>

<h1 class="fr-mb-6w fr-h2">
    {controller.pageTitle}
</h1>
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

<div class="fr-p-8v fr-mt-12v">
    <div class="fr-col-6 fr-col-offset-3">
        <p>
            ProConnect vous permet d’accéder à de nombreux services en ligne en utilisant l’un de vos comptes
            professionnels existants.
        </p>
        <AgentConnectZone />
        <form on:submit|preventDefault={() => controller.submit()}>
            <fieldset class="fr-fieldset fr-mb-5w">
                <legend class="fr-fieldset__legend fr-h5 text-center fr-p-0" id="login-legend">
                    Veuillez saisir vos identifiants pour utiliser ce service :
                </legend>
                <div class="fr-fieldset__element fr-mt-2v">
                    <Input
                        id="email-input"
                        type="email"
                        label="Email professionnel"
                        autocomplete="email"
                        bind:value={controller.email}
                        required={true} />
                </div>
                <div class="fr-fieldset__element fr-mt-2v">
                    <PasswordInput label="Mot de passe" bind:value={controller.password} />
                    <p>
                        <a href={controller.forgetPasswordUrl} class="fr-link">Mot de passe oublié ?</a>
                    </p>
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
</div>

<script>
    import { onMount } from "svelte";
    import SignupController from "./Signup.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Input from "$lib/dsfr/Input.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import AgentConnectZone from "$lib/components/AgentConnectZone.svelte";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";

    let alertElement;
    const ctrl = new SignupController();
    const { signupUser, signupPromise, firstSubmitted, acceptWorkEthic, workEthicError } = ctrl;
    onMount(() => ctrl.onMount(alertElement));
</script>

<h1 class="fr-mb-6w fr-h2">
    {ctrl.pageTitle}
</h1>
<div bind:this={alertElement}>
    {#await $signupPromise}
        <div class="fr-mb-5w fr-mt-n4w">
            <Spinner />
        </div>
    {:then email}
        {#if $firstSubmitted}
            <Alert title="Félicitations, votre inscription a bien été prise en compte" type="success">
                Vous allez recevoir un mail pour finaliser votre inscription
            </Alert>

            <Alert title="Vous n'avez pas reçu de mail ?" type="info">
                Vous pouvez
                <a
                    title="Contactez-nous - nouvelle fenêtre"
                    href="mailto:{ctrl.contactEmail}?subject=Lien%20d'inscription%20non%20re%C3%A7u&body=Bonjour, %0D%0A %0D%0AJe viens de m'inscrire avec l'adresse {email} mais je n'ai reçu aucun mail d'activation. %0D%0A %0D%0APouvez-vous débloquer la situation?&html=true"
                    target="_blank"
                    rel="noopener noreferrer">
                    nous contacter
                </a>
                pour qu'on règle ce problème.
            </Alert>
        {/if}
    {:catch error}
        <Alert title="Attention" type="warning">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html ctrl.getErrorMessage(error)}
        </Alert>
    {/await}

    <Alert
        title="Data.subvention étant réservé aux agents publics, il est nécessaire d'être doté d'une adresse e-mail professionnelle du service public."
        type="info" />
</div>

<div class="bordered-frame fr-col-6 fr-col-offset-3 fr-p-8v fr-mt-12v">
    <AgentConnectZone />
    <form on:submit|preventDefault={() => ctrl.signup()}>
        <fieldset class="fr-fieldset fr-mt-3w fr-mb-5w">
            <legend class="fr-fieldset__legend">
                <h2 class="fr-h5">Créer un compte</h2>
            </legend>
            <div class="fr-fieldset__element fr-fieldset__element--inline fr-fieldset__element--inline-grow">
                <Input label="Prénom :" id="signup-given-name" bind:value={$signupUser.firstname} required={true} />
            </div>
            <div class="fr-fieldset__element fr-fieldset__element--inline fr-fieldset__element--inline-grow">
                <Input label="NOM :" id="signup-family-name" bind:value={$signupUser.lastname} required={true} />
            </div>
            <div class="fr-fieldset__element fr-mt-4v">
                <Input
                    label="Adresse e-mail professionnelle :"
                    id="signup-email"
                    bind:value={$signupUser.email}
                    required={true} />
            </div>
            <div class="fr-fieldset__element fr-mt-4v">
                <Checkbox
                    options={ctrl.WORK_ETHIC_OPTIONS}
                    label=""
                    errorMsg={$workEthicError}
                    required={true}
                    on:change={v => ctrl.checkWorkEthic(v)}
                    bind:value={$acceptWorkEthic} />
            </div>

            <div class="fr-fieldset__element fr-mt-4v">
                <ul class="fr-btns-group">
                    <li>
                        <Button title="Créer un compte" htmlType="submit" trackerName="signup.form.submit">
                            Créer un compte
                        </Button>
                    </li>
                </ul>
            </div>
            <div class="policy fr-mx-12w">
                <span>
                    En vous inscrivant, vous acceptez la
                    <a
                        href={ctrl.privacyPolicyUrl}
                        target="_blank"
                        rel="noopener external"
                        title="politique de confidentialité - nouvelle fenêtre">
                        politique de confidentialité
                    </a>
                    et les
                    <a
                        href={ctrl.cguUrl}
                        target="_blank"
                        rel="noopener external"
                        title="conditions générales d'utilisations - nouvelle fenêtre">
                        conditions générales d'utilisations
                    </a>
                    de Data.Subvention.
                </span>
            </div>
        </fieldset>
    </form>
    <div class="separator" />
    <form on:submit|preventDefault={() => ctrl.signin()}>
        <fieldset class="fr-fieldset fr-mt-3w fr-mb-5w">
            <legend class="fr-fieldset__legend">
                <h2 class="fr-h5">Vous avez déjà un compte ?</h2>
            </legend>
            <div class="fr-fieldset__element">
                <ul class="fr-btns-group">
                    <li>
                        <Button type="secondary" title="Se connecter" htmlType="submit" trackerName="signup.form.login">
                            Se connecter
                        </Button>
                    </li>
                </ul>
            </div>
        </fieldset>
    </form>
</div>

<style>
    .policy {
        text-align: center;
        color: var(--text-mention-grey);
        font-weight: 700;
    }

    .policy a {
        color: var(--text-default-grey);
    }
</style>

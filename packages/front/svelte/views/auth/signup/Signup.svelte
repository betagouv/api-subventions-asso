<script>
    import SignupController from "./Signup.controller";
    import Alert from "@dsfr/Alert.svelte";
    import Input from "@dsfr/Input.svelte";
    import Button from "@dsfr/Button.svelte";
    import Spinner from "@components/Spinner.svelte";

    const ctrl = new SignupController();
    const { email, signupPromise, firstSubmitted } = ctrl;
</script>

<h1 class="fr-mb-6w fr-h2">
    {ctrl.pageTitle}
</h1>
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
                title="Contactez-nous"
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
        {@html ctrl.getErrorMessage(error)}
    </Alert>
{/await}

<Alert
    title="Data.subvention étant réservé aux agents du service public, il est nécessaire d'être doté d'une adresse e-mail
            professionnelle du service public."
    type="info" />

<form action="#" method="GET" on:submit|preventDefault={() => ctrl.onSubmit()}>
    <fieldset class="fr-fieldset fr-mt-3w fr-mb-5w">
        <div class="fr-input-group fr-ml-1w">
            <Input label="Email professionnel:" id="signup-email" bind:value={$email} required={true} />
        </div>
    </fieldset>
    <div class="fr-input-group">
        <Button type="submit" title="S'inscrire" htmlType="submit">Confirmer</Button>
    </div>
</form>

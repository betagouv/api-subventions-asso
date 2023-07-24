<script>
    import ForgetPwdController from "./ForgetPwd.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Input from "$lib/dsfr/Input.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Spinner from "$lib/components/Spinner.svelte";

    const ctrl = new ForgetPwdController();
    const { email, promise, firstSubmitted } = ctrl;
</script>

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-8">
        <h1>Mot de passe perdu</h1>
        {#await $promise}
            <div class="fr-mb-5w fr-mt-n4w">
                <Spinner />
            </div>
        {:then}
            {#if $firstSubmitted}
                <Alert type="success">
                    <p>
                        Si vous possédez déjà un compte sur Data.Subvention, vous recevrez un mail pour réinitialiser
                        votre mot de passe.
                    </p>
                    <p>
                        Retourner à la page <a class="fr-link" href="/auth/login">connexion</a>
                    </p>
                </Alert>
            {/if}
        {:catch}
            <Alert title="Attention" type="warning">Une erreur est survenue. Veuillez réessayer plus tard.</Alert>
        {/await}

        <form action="#" method="GET" on:submit|preventDefault={() => ctrl.onSubmit()}>
            <fieldset class="fr-fieldset fr-my-4w">
                <Input label="Email :" id="email" bind:value={$email} required type="email" />
            </fieldset>
            <div class="fr-input-group fr-my-4w">
                <Button type="submit" title="Valider" htmlType="submit">Valider</Button>
                <a class="fr-link" href="/auth/login">Retour à la page Connexion</a>
            </div>
        </form>
    </div>
</div>

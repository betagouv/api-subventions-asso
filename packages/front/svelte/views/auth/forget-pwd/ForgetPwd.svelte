<script>
    import padlockSvg from "@gouvfr/dsfr/dist/artwork/pictograms/system/padlock.svg";

    import ForgetPwdController from "./ForgetPwd.controller";
    import Alert from "@dsfr/Alert.svelte";
    import Input from "@dsfr/Input.svelte";
    import Button from "@dsfr/Button.svelte";
    import Spinner from "@components/Spinner.svelte";

    const ctrl = new ForgetPwdController();
    const { email, promise, firstSubmitted } = ctrl;
</script>

<div class="fr-grid-row fr-grid-row--center fr-p-8v">
    <div class="forget-pwd fr-col-6 fr-p-8v">
        <div class="svg">{@html padlockSvg}</div>
        <h2 class="fr-mt-6v">Mot de passe oublié ?</h2>
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
                <div class="fr-fieldset__element">
                    <Input
                        label="Entrez l'email utilisé lors de la création du compte :"
                        id="email"
                        bind:value={$email}
                        required
                        type="email" />
                </div>
                <div class="fr-fieldset__element flex center">
                    <Button title="Demander un nouveau mot de passe" htmlType="submit">
                        Demander un nouveau mot de passe
                    </Button>
                </div>
            </fieldset>
            <a class="fr-link" href="/auth/login">Retour à la page Connexion</a>
        </form>
    </div>
</div>

<style>
    h2 {
        text-align: center;
    }

    .svg {
        width: 80px;
        height: 80px;
        margin: auto;
    }

    .forget-pwd {
        margin: auto;
        border: 2px solid var(--border-default-grey);
    }
</style>

<script>
    import padlockSvg from "@gouvfr/dsfr/dist/artwork/pictograms/system/padlock.svg";

    import ForgetPwdController from "./ForgetPwd.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Input from "$lib/dsfr/Input.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Spinner from "$lib/components/Spinner.svelte";

    const ctrl = new ForgetPwdController();
    const { email, promise, firstSubmitted } = ctrl;
</script>

<div class="fr-grid-row fr-grid-row--center fr-p-8v">
    <div class="fr-col-6 fr-p-8v fr-m-auto bordered-frame">
        <div class="svg">
            <img src={padlockSvg} alt="" />
        </div>
        <h2 class="fr-mt-6v text-center">Mot de passe oublié ?</h2>
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
        {:catch error}
            <Alert title="Attention" type="warning">
                {#if ctrl.errorMsgByCode[error.code]}
                    {ctrl.errorMsgByCode[error.code]}
                {:else}
                    Une erreur est survenue. Veuillez réessayer plus tard.
                {/if}
            </Alert>
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
                    <Button
                        title="Demander un nouveau mot de passe"
                        htmlType="submit"
                        trackerName="forget-password.form.submit">
                        Demander un nouveau mot de passe
                    </Button>
                </div>
            </fieldset>
            <a class="fr-link" href="/auth/login">Retour à la page Connexion</a>
        </form>
    </div>
</div>

<style>
    .svg {
        width: 80px;
        height: 80px;
        margin: auto;
    }
</style>

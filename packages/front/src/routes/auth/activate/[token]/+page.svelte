<script>
    import ActivateAccount from "./ActivateAccount.controller";
    import PasswordErrorAlert from "$lib/components/DefinePassword/PasswordErrorAlert.svelte";
    import MultiStepForm from "$lib/components/MultiStepForm/MultiStepForm.svelte";
    import Spinner from "$lib/components/Spinner.svelte";

    export let data;

    const { token } = data.params;

    const controller = new ActivateAccount(token);
    const { validationTokenStore } = controller;

    controller.init();
</script>

{#if $validationTokenStore === "waiting"}
    <div class="fr-mb-5w fr-mt-n4w">
        <Spinner />
    </div>
{:else if $validationTokenStore === "invalid"}
    <PasswordErrorAlert error={controller.error} />
{:else}
    <h1>Créer votre compte</h1>

    <MultiStepForm
        steps={controller.steps}
        buildContext={controller.buildContext}
        onSubmit={values => controller.onSubmit(values)}
        submitLabel="Valider l'inscription"
        customSubmitTracking={true}
        trackerFormName="activate" />
{/if}

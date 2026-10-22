<script>
    import SignupPCController from "./SignupPC.controller";
    import ErrorAlert from "$lib/components/ErrorAlert.svelte";
    import MultiStepForm from "$lib/components/MultiStepForm/MultiStepForm.svelte";

    const controller = new SignupPCController();
    const { errorMessage } = controller;
</script>

{#if $errorMessage}
    <ErrorAlert message={$errorMessage} />
{/if}

<h1>Dernières étapes ! Nous aimerions en savoir un peu plus sur vous</h1>

<MultiStepForm
    steps={controller.steps}
    buildContext={controller.buildContext}
    onSubmit={values => controller.onSubmit(values)}
    submitLabel="Valider les informations"
    customSubmitTracking={false}
    trackerFormName="signup-pc" />

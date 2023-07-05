<script>
    import SignupFormController from "./SignupForm.controller";

    const ctrl = new SignupFormController();
    const { stepId, currentStepData, step, nextStep, stepsStateById } = ctrl;
</script>

<h1>Titre exemple du formulaire</h1>

<div class="fr-stepper">
    <h2 class="fr-stepper__title">
        <span class="fr-stepper__state">Étape {$step.index} sur {ctrl.finalStepIndex}</span>
        {$step.title | ""}
    </h2>
    <div class="fr-stepper__steps" data-fr-current-step={$step.index} data-fr-steps={ctrl.finalStepIndex} />
    {#if $nextStep}
        <p class="fr-stepper__details">
            <span class="fr-text--bold">Étape suivante :</span>
            {$nextStep.title | ""}
        </p>
    {/if}
</div>

{#key $stepId}
    <svelte:component
        this={$step.component}
        onSubmit={ctrl.onSubmit}
        onBack={ctrl.onBack}
        initialValues={$stepsStateById[$stepId]}
        standalone={false}
        bind:data={$currentStepData} />
{/key}
<!-- steps are in charge of previous/next buttons -->

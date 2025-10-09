<script lang="ts">
    import StepIndicatorController from "$lib/components/StepIndicator/StepIndicator.controller";

    export let currentStep: number;
    export let stepsDesc: string[];

    const controller = new StepIndicatorController(currentStep, stepsDesc);

    $: controller.currentStep = currentStep;
</script>

<div class="fr-stepper">
    <h2 class="fr-stepper__title">
        {controller.currentStepTitle}
        <span class="fr-stepper__state">Étape {controller.currentStep} sur {controller.totalSteps}</span>
    </h2>
    <div class="fr-stepper__steps" data-fr-current-step={controller.currentStep} data-fr-steps={controller.totalSteps}>
    </div>
    <p class="fr-stepper__details">
        <span class="fr-text--bold">Étape suivante :</span>
        {controller.nextStepTitle}
    </p>
</div>

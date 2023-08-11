<script>
    import { onDestroy } from "svelte";
    import MultiStepFormController from "./MultiStepForm.controller";
    import Button from "$lib/dsfr/Button.svelte";

    export let steps = [];
    export let onSubmit;
    export let submitLabel = "Confirmer";
    export let nextLabel = "Suivant";
    export let previousLabel = "Précédent";
    export let trackerFormName;

    const controller = new MultiStepFormController(steps, onSubmit);

    onDestroy(() => controller.onDestroy());

    const { currentStep, data, isStepBlocked } = controller;
</script>

<div class="fr-grid-row">
    <div class="fr-stepper">
        <h2 class="fr-stepper__title">
            {#if steps.length > 1}
                <span class="fr-stepper__state">Étape {$currentStep.positionLabel} sur {steps.length}</span>
            {/if}
            {$currentStep.step.name}
        </h2>
        <div class="fr-stepper__steps" data-fr-current-step={$currentStep.positionLabel} data-fr-steps={steps.length} />
        {#if !$currentStep.isLastStep}
            <p class="fr-stepper__details">
                <span class="fr-text--bold">Étape suivante :</span>
                {$currentStep.nextStepName || `étape ${$currentStep.nextStepPositionLabel}`}
            </p>
        {/if}
    </div>
</div>

<div class="fr-grid-row">
    {#if $currentStep.step.alert}
        <svelte:component this={$currentStep.step.alert} />
    {/if}
</div>

<div class="fr-grid-row">
    <div class="fr-col-6">
        <form action="#" method="GET" on:submit|preventDefault={() => controller.submit()}>
            <svelte:component
                this={$currentStep.step.component}
                bind:values={$data[$currentStep.index]}
                on:error={() => controller.blockStep()}
                on:valid={() => controller.unblockStep()} />
            {#if !$currentStep.isFirstStep}
                <Button
                    htmlType="button"
                    type="secondary"
                    on:click={() => controller.previous()}
                    disabled={$currentStep.isFirstStep}
                    trakerName={`${trackerFormName}.form.step${$currentStep.positionLabel}.previous`}>
                    {previousLabel}
                </Button>
            {/if}
            {#if $currentStep.isLastStep}
                <Button 
                    htmlType="submit"
                    disabled={$isStepBlocked}
                    trakerName={`${trackerFormName}.form.step${$currentStep.positionLabel}.submit`}
                >
                    {submitLabel}
                </Button>
            {:else}
                <Button
                    htmlType="submit"
                    type="secondary"
                    on:click={() => controller.next()}
                    on:submit={() => controller.next()}
                    trakerName={`${trackerFormName}.form.step${$currentStep.positionLabel}.next`}>
                    {nextLabel}
                </Button>
            {/if}
        </form>
    </div>
</div>

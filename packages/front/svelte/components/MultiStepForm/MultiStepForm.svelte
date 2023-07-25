<script>
    import { onDestroy } from "svelte";
    import MultiStepFormController from "./MultiStepForm.controller";
    import Button from "@dsfr/Button.svelte";

    export let steps = [];
    export let onSubmit;

    const controller = new MultiStepFormController(steps, onSubmit);

    onDestroy(() => controller.onDestroy());

    const { currentStep, data, isStepBlocked} = controller;
</script>

<div class="fr-stepper">
    <h2 class="fr-stepper__title">
        <span class="fr-stepper__state">Étape {$currentStep.positionLabel} sur {steps.length}</span>
        {$currentStep.step.name}
    </h2>
    <div class="fr-stepper__steps" data-fr-current-step={$currentStep.positionLabel} data-fr-steps={steps.length} />
    {#if !$currentStep.isLastStep}
        <p class="fr-stepper__details">
            <span class="fr-text--bold">Étape suivante :</span>
            {($currentStep.step).name || `étape ${$currentStep.positionLabel}`}
        </p>
    {/if}
</div>

{#if ($currentStep.step).alert}
    <svelte:component this={($currentStep.step).alert} />
{/if}

<form action="#" method="GET" on:submit|preventDefault={() => controller.submit()}>
    <svelte:component 
        this={($currentStep.step).component} 
        bind:values={$data[$currentStep.index]}
        on:error={() => controller.blockStep()}
        on:valid={() => controller.unblockStep()}
    />
    <div class="fr-mt-6v">
        <Button
            htmlType="button"
            type="secondary"
            on:click={() => controller.previous()}
            disabled={$currentStep.isFirstStep}>
            Previous
        </Button>
        {#if $currentStep.isLastStep}
            <Button htmlType="submit" disabled={$isStepBlocked}>Submit</Button>
        {:else}
            <Button htmlType="submit" type="secondary" on:click={() => controller.next()} on:submit={() => controller.next()}>Next</Button>
        {/if}
    </div>
</form>

<style>
    form {
        width: 50%;
    }

    .fr-stepper {
        margin-bottom: 0px;
    }
</style>

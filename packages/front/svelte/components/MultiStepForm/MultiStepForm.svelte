<script>
    import MultiStepFormController from "./MultiStepForm.controller";
    import Button from "@dsfr/Button.svelte";

    export let steps = [];
    export let onSubmit;

    const controller = new MultiStepFormController(steps, onSubmit);
    const { currentStepIndex, data } = controller;

    $: currentStep = $currentStepIndex + 1;
    $: firstStep = $currentStepIndex == 0;
    $: lastStep = $currentStepIndex == controller.nbSteps - 1;
</script>

<div class="fr-stepper">
    <h2 class="fr-stepper__title">
        <span class="fr-stepper__state">Étape {currentStep} sur {controller.nbSteps}</span>
        {steps[$currentStepIndex].name}
    </h2>
    <div class="fr-stepper__steps" data-fr-current-step={currentStep} data-fr-steps={controller.nbSteps} />
    {#if !lastStep}
        <p class="fr-stepper__details">
            <span class="fr-text--bold">Étape suivante :</span>
            {steps[$currentStepIndex + 1].name || `étape ${$currentStepIndex + 1}`}
        </p>
    {/if}
</div>

<form action="#" method="GET" on:submit|preventDefault={() => controller.submit()}>
    {#each steps as step, index}
        {#if firstStep && index == 0}
            <svelte:component this={step.component} bind:values={$data[index]} />
        {:else if lastStep && index == controller.nbSteps - 1}
            <svelte:component this={step.component} bind:values={$data[index]} />
        {:else if index == $currentStepIndex}
            <svelte:component this={step.component} bind:values={$data[index]} />
        {/if}
    {/each}
    <div class="fr-mt-6v">
        <Button
            htmlType="button"
            type="secondary"
            on:click={() => controller.previous()}
            disabled={firstStep ? true : false}>
            Previous
        </Button>
        {#if lastStep}
            <Button htmlType="submit">Submit</Button>
        {:else}
            <Button htmlType="button" type="secondary" on:click={() => controller.next()}>Next</Button>
        {/if}
    </div>
</form>

<style>
</style>

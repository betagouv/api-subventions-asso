<script>
    import Fieldset from "./Fieldset.svelte";

    export let steps = [];
    export let onSubmit;

    let currentStep = 1;
    const nbSteps = steps.length;
    let mapStepToValues = steps.map(() => ({}));

    $: values = mapStepToValues.reduce((acc, curr) => {
        return { ...acc, ...curr };
    }, {});

    $: currentStepIndex = currentStep - 1;
    $: firstStep = currentStep == 1;
    $: lastStep = currentStep == nbSteps;

    function submit() {
        onSubmit(values);
    }

    function next() {
        if (lastStep) return;
        currentStep++;
    }

    function previous() {
        if (firstStep) return;
        currentStep--;
    }
</script>

<div class="fr-stepper">
    <h2 class="fr-stepper__title">
        <span class="fr-stepper__state">Étape {currentStep} sur {nbSteps}</span>
        {steps[currentStepIndex].name || ""}
    </h2>
    <div class="fr-stepper__steps" data-fr-current-step={currentStep} data-fr-steps={nbSteps} />
    {#if !lastStep}
        <p class="fr-stepper__details">
            <span class="fr-text--bold">Étape suivante :</span>
            {steps[currentStepIndex + 1].name || `étape ${currentStep + 1}`}
        </p>
    {/if}
</div>

<form action="#" method="GET" on:submit|preventDefault={submit}>
    {#each steps as step, index}
        {#if firstStep && index == 0}
            <Fieldset on:next={next} firstStep={true}>
                <svelte:component this={step.component} bind:values={mapStepToValues[index]} />
            </Fieldset>
        {:else if lastStep && index == steps.length - 1}
            <Fieldset on:previous={previous} lastStep={true}>
                <svelte:component this={step.component} bind:values={mapStepToValues[index]} />
            </Fieldset>
        {:else if index == currentStepIndex}
            <Fieldset on:previous={previous} on:next={next}>
                <svelte:component this={step.component} bind:values={mapStepToValues[index]} />
            </Fieldset>
        {/if}
    {/each}
</form>

<style>
</style>

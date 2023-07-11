<script>
    import Fieldset from "./Fieldset.svelte";

    export let steps = [];
    export let onSubmit;

    let currentStep = 0;
    let mapStepToValues = steps.map(() => ({}));

    $: values = mapStepToValues.reduce((acc, curr) => {
        return { ...acc, ...curr };
    }, {});

    $: firstStep = currentStep == 0;
    $: lastStep = currentStep == steps.length - 1;

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

<form action="#" method="GET" on:submit|preventDefault={submit}>
    {#each steps as step, index}
        {#if firstStep && index == 0}
            <Fieldset on:next={next} firstStep={true}>
                <svelte:component this={step} bind:values={mapStepToValues[index]} />
            </Fieldset>
        {:else if lastStep && index == steps.length - 1}
            <Fieldset on:previous={previous} lastStep={true}>
                <svelte:component this={step} bind:values={mapStepToValues[index]} />
            </Fieldset>
        {:else if index == currentStep}
            <Fieldset on:previous={previous} on:next={next}>
                <svelte:component this={step} bind:values={mapStepToValues[index]} />
            </Fieldset>
        {/if}
    {/each}
</form>

<style>
</style>

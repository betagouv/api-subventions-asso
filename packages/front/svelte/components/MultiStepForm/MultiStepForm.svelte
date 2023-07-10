<script>
    import { createEventDispatcher } from "svelte";
    export let steps;
    const dispatch = createEventDispatcher();
    let currentStep = 0;
    let values = {};

    function test(event) {
        console.log(event);
    }

    function submit(event) {
        console.log("multi step submit", event);
        dispatch("submit", {
            values,
        });
    }

    function next() {
        if (currentStep == steps.length - 1) return;
        currentStep++;
    }

    function previous() {
        if (currentStep == 0) return;
        currentStep--;
    }
</script>

Hello Form

<form action="#" method="GET" on:submit|preventDefault={submit}>
    {#each steps as step, index}
        {#if index === 0}
            <svelte:component this={step} on:next={next} on:change={test} />
        {:else if index === steps.length - 1}
            <svelte:component this={step} on:previous={previous} />
        {:else}
            <svelte:component this={step} on:previous={previous} on:next={next} />
        {/if}
    {/each}
</form>

<style>
</style>

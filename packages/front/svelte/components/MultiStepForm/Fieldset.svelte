<script>
    import { createEventDispatcher } from "svelte";
    import Button from "@dsfr/Button.svelte";
    const dispatch = createEventDispatcher();
    export let lastStep = false;
    export let firstStep = false;

    const previous = () => dispatch("previous");
    const next = () => dispatch("next");
    const submit = () => dispatch("submit");
</script>

<fieldset>
    <slot />
    <Button type="secondary" on:click={previous} disabled={firstStep ? true : false}>Previous</Button>
    {#if lastStep}
        <Button on:click={submit}>Submit</Button>
    {:else}
        <Button type="secondary" on:click={next}>Next</Button>
    {/if}
</fieldset>

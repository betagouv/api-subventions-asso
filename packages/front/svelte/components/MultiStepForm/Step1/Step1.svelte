<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let value;

    function submit() {
        console.log("step 1 submit");
        dispatch("submit", {
            value,
        });
    }

    import Button from "@dsfr/Button.svelte";
    import Input from "@dsfr/Input.svelte";
</script>

{value}
<Input label="Input 1" bind:value />
<Button on:click={submit}>Submit</Button>

<style>
</style>

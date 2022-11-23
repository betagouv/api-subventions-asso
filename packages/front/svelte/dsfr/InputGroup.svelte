<script>
    import Input from "./Input.svelte";
    import { isBoolean } from "../helpers/validatorHelper";

    export let desc;
    export let value;
    export let valid = undefined;

    $: descClass = valid ? "fr-valid-text" : "fr-error-text"
    $: inputGroupClass = valid ? "fr-input-group--valid" : "fr-input-group--error"

</script>

<div class={inputGroupClass}>
    <div class="input-layout">
        <Input bind:value aria-describedby="text-input-desc" {valid}/>
    </div>
    {#if desc && isBoolean(valid) }
        <p id="text-input-desc" class={descClass}>
            {desc}
        </p>
    {/if}
</div>
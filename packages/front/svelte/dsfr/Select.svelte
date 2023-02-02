<script>
    import { createEventDispatcher } from "svelte";

    export let options;
    export let selected = undefined;
    export let label = undefined;
    export let narrow = false;
    export let id = "0";

    const name = `input-text-${id}`;

    const dispatch = createEventDispatcher();

    function onChange(e) {
        dispatch("change", e.target.selectedIndex - 1);
    }
</script>

<div class="fr-select-group" style:width={narrow ? "fit-content" : undefined}>
    {#if label}
        <label class="fr-label" for={name}>{label}</label>
    {/if}
    <select bind:value={selected} on:change={onChange} class="fr-select" {name} id={name}>
        <option value="" selected disabled hidden>Sélectionnez une option</option>
        {#each options as option, index}
            <option value={option.value ? option.value : index}>{option.label ? option.label : option}</option>
        {/each}
    </select>
</div>

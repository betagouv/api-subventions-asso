<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let selected = undefined;

    function onChange(e) {
        dispatch("change", e.target.selectedIndex - 1);
    }

    export let options;
    export let label = undefined;
</script>

<div class="fr-select-group">
    {#if label}
        <label class="fr-label" for="select">{label}</label>
    {/if}
    <select bind:value={selected} on:change={onChange} class="fr-select" name="select">
        <option value="" selected disabled hidden>Selectionnez une option</option>
        {#each options as option, index}
            <option value={option.value ? option.value : index}>{option.label ? option.label : option}</option>
        {/each}
    </select>
</div>

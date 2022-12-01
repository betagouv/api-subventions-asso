<script>
    import { createEventDispatcher } from "svelte";

    export let options;
    export let selected = undefined;
    export let label = undefined;

    const dispatch = createEventDispatcher();

    function onChange(e) {
        dispatch("change", e.target.selectedIndex - 1);
    }
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

<script>
    import { createEventDispatcher } from "svelte";
    import { nanoid } from "nanoid";

    export let options;
    export let selected = undefined;
    export let label = undefined;
    export let narrow = false;
    export let id = nanoid(7);
    export let required = false;
    export let disabled = false;

    const name = `select-${id}`;

    const dispatch = createEventDispatcher();

    function onChange(e) {
        dispatch("change", e.target.selectedIndex - 1);
    }
</script>

<div class="fr-select-group" style:width={narrow ? "fit-content" : undefined}>
    {#if label}
        <label class="fr-label" for={name}>{label}</label>
    {/if}
    <select
        bind:value={selected}
        required={required ? "required" : undefined}
        disabled={disabled ? "disabled" : undefined}
        on:change={onChange}
        class="fr-select"
        {name}
        id={name}>
        <option value="" selected disabled hidden>Sélectionner une option</option>
        {#each options as option, index (index)}
            <option value={option.value ? option.value : index}>{option.label ? option.label : option}</option>
        {/each}
    </select>
</div>

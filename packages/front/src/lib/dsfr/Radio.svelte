<script lang="ts">
    import { nanoid } from "nanoid";
    import Dispatch from "$lib/core/Dispatch";

    export let value: string;

    export let label: string;
    export let options: { label: string; value: string; hint?: string }[] = [];
    export let id = nanoid(7);
    export let name = `radio-${id}`;
    export let hint = "";
    export let required = false;
    export let inline = false;

    const dispatch = Dispatch.getDispatcher();
</script>

<fieldset class="fr-fieldset" {id} aria-labelledby="{id}-legend {id}-messages">
    <legend class="fr-fieldset__legend--regular fr-fieldset__legend" id="{id}-legend">
        {label}
        {#if hint}<span class="fr-hint-text">{@html hint}</span>{/if}
    </legend>
    {#each options as option, i}
        <div class="fr-fieldset__element" class:fr-fieldset__element--inline={inline}>
            <div class="fr-radio-group">
                <input
                    type="radio"
                    id="{id}-{i}"
                    {name}
                    value={option.value}
                    {required}
                    bind:group={value}
                    on:change={() => dispatch("change", option)} />
                <label class="fr-label" for="{id}-{i}">
                    {option.label}
                    {#if option.hint}<span class="fr-hint-text">{@html option.hint}</span>{/if}
                </label>
            </div>
        </div>
    {/each}
    <div class="fr-messages-group" id="{id}-messages" aria-live="assertive" />
</fieldset>

<script lang="ts">
    import { nanoid } from "nanoid";
    import Dispatch from "$lib/core/Dispatch";

    export let value: string[];

    export let label: string;
    export let options: { label: string; value: string; hint?: string }[] = [];
    export let id = nanoid(7);
    export let name = `checkbox-${id}`;
    export let required = false;
    export let inline = false;

    const dispatch = Dispatch.getDispatcher();

    // if hints are necessary refer to radio component
</script>

<fieldset class="fr-fieldset" {id} aria-labelledby="{id}-legend {id}-messages">
    <legend class="fr-fieldset__legend--regular fr-fieldset__legend" id="{id}-legend">
        {label}
    </legend>
    {#each options as option, i}
        <div class="fr-fieldset__element" class:fr-fieldset__element--inline={inline}>
            <div class="fr-checkbox-group">
                <input
                    type="checkbox"
                    id="{id}-{i}"
                    {name}
                    value={option.value}
                    {required}
                    bind:group={value}
                    aria-describedby="{id}-messages"
                    on:change={() => dispatch("change", option)} />
                <label class="fr-label" for="{id}-{i}">
                    {option.label}
                </label>
                <div class="fr-messages-group" id="checkboxes-1-messages" aria-live="assertive" />
            </div>
        </div>
    {/each}
    <div class="fr-messages-group" id="{id}-messages" aria-live="assertive" />
</fieldset>

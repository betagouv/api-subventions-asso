<script lang="ts">
    import { nanoid } from "nanoid";
    import Dispatch from "$lib/core/Dispatch";

    export let value: string;

    export let label: string;
    export let options: { label: string; value: string; hintHtml?: string }[] = [];
    export let id = nanoid(7);
    export let name = `radio-${id}`;
    export let hintHtml = "";
    export let required = false;
    export let inline = false;
    export let errorMsgHtml = "";

    const descErrorElement = `${id}-desc-error`;

    const dispatch = Dispatch.getDispatcher();
</script>

<fieldset class="fr-fieldset" {id} aria-labelledby="{id}-legend {id}-messages" class:fr-fieldset--error={errorMsgHtml}>
    <legend class="fr-fieldset__legend--regular fr-fieldset__legend" id="{id}-legend">
        {label}
        {#if hintHtml}<span class="fr-hint-text">{@html hintHtml}</span>{/if}
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
                <label
                    class="fr-label"
                    for="{id}-{i}"
                    aria-invalid={errorMsgHtml ? "true" : undefined}
                    aria-errormessage={errorMsgHtml ? descErrorElement : undefined}>
                    {option.label}
                    {#if option.hintHtml}<span class="fr-hint-text">{@html option.hintHtml}</span>{/if}
                </label>
            </div>
        </div>
    {/each}
    <div class="fr-messages-group" id="{id}-messages" aria-live="polite">
        {#if errorMsgHtml}
            <p class="fr-message fr-message--error" id={descErrorElement}>
                <span>{@html errorMsgHtml}</span>
            </p>
        {/if}
    </div>
</fieldset>

<script lang="ts">
    import { nanoid } from "nanoid";

    type RadioOption = { label: string; value: string; hintHtml?: string };

    interface Props {
        value: string;
        label: string;
        options?: RadioOption[];
        id?: string;
        name?: string;
        hintHtml?: string;
        required?: boolean;
        inline?: boolean;
        errorMsgHtml?: string;
        onchange?: (option: RadioOption) => void;
    }

    let {
        value = $bindable(),
        label,
        options = [],
        id = nanoid(7),
        name = `radio-${id}`,
        hintHtml = "",
        required = false,
        inline = false,
        errorMsgHtml = "",
        onchange = () => {},
    }: Props = $props();

    const descErrorElement = `${id}-desc-error`;
</script>

<fieldset class="fr-fieldset" {id} aria-labelledby="{id}-legend {id}-messages" class:fr-fieldset--error={errorMsgHtml}>
    <legend class="fr-fieldset__legend--regular fr-fieldset__legend" id="{id}-legend">
        {label}
        {#if hintHtml}<span class="fr-hint-text">{@html hintHtml}</span>{/if}
    </legend>
    {#each options as option, i (i)}
        <div class="fr-fieldset__element" class:fr-fieldset__element--inline={inline}>
            <div class="fr-radio-group">
                <input
                    type="radio"
                    id="{id}-{i}"
                    {name}
                    value={option.value}
                    {required}
                    bind:group={value}
                    onchange={() => onchange(option)} />
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

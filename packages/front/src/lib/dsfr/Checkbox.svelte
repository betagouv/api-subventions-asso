<script lang="ts">
    import { nanoid } from "nanoid";

    type CheckboxOption = { label: string; value: string; hint?: string; withHtml?: boolean };

    interface Props {
        value?: string[];
        label?: string | null;
        options?: CheckboxOption[];
        id?: string;
        name?: string;
        required?: boolean;
        inline?: boolean;
        errorMsg?: string;
        onchange?: (option: CheckboxOption) => void;
    }

    let {
        value = $bindable([]),
        label = null,
        options = [],
        id = nanoid(7),
        name = `checkbox-${id}`,
        required = false,
        inline = false,
        errorMsg = "",
        onchange = () => {},
    }: Props = $props();

    const descErrorElement = `${id}-desc-error`;

    // if hints are necessary refer to radio component
</script>

<fieldset class="fr-fieldset" {id} aria-labelledby="{id}-legend {id}-messages" class:fr-fieldset--error={errorMsg}>
    {#if label}
        <legend class="fr-fieldset__legend--regular fr-fieldset__legend" id="{id}-legend">
            {label}
        </legend>
    {/if}
    {#each options as option, i (i)}
        <div class="fr-fieldset__element" class:fr-fieldset__element--inline={inline}>
            <div class="fr-checkbox-group">
                <input
                    type="checkbox"
                    id="{id}-{i}"
                    {name}
                    value={option.value}
                    {required}
                    aria-required={required}
                    bind:group={value}
                    aria-describedby="{id}-messages"
                    onchange={() => onchange(option)}
                    aria-invalid={errorMsg ? "true" : undefined}
                    aria-errormessage={errorMsg ? descErrorElement : undefined} />
                <label class="fr-label" for="{id}-{i}">
                    {#if option.withHtml}
                        {@html option.label}
                    {:else}
                        {option.label}
                    {/if}
                </label>
                <div class="fr-messages-group" id="checkboxes-1-messages" aria-live="polite" />
            </div>
        </div>
    {/each}
    <div class="fr-messages-group" id="{id}-messages" aria-live="polite">
        {#if errorMsg}
            <p class="fr-message fr-message--error" id={descErrorElement}>
                {errorMsg}
            </p>
        {/if}
    </div>
</fieldset>

<script lang="ts">
    import { nanoid } from "nanoid";

    interface Props {
        label: string;
        value: string | number | undefined;
        id?: string;
        required?: boolean;
        disabled?: boolean | "true";
        type?: string;
        name?: string;
        autocomplete?: string;
        placeholder?: string;
        error?: string;
        errorMsg?: string | null;
        hint?: string;
        onblur?: (event: FocusEvent) => void;
        oninput?: (event: Event) => void;
        onchange?: (event: Event) => void;
    }

    let {
        label,
        value = $bindable(),
        id = nanoid(7),
        required = false,
        disabled = false,
        type = "text",
        name = `input-${id}`,
        autocomplete = "false",
        placeholder = "",
        error = "",
        errorMsg = null,
        hint = "",
        onblur = () => {},
        oninput = () => {},
        onchange = () => {},
    }: Props = $props();

    let spellcheck = $state(true);

    const descErrorElement = `${name}-desc-error`;

    // DSFR best practices
    if (["given-name", "family-name"].includes(name)) {
        spellcheck = false;
    }

    /*
    svelte needs to know beforehand the input type to manage reactivity
    use:typeAction is a workaround
    cf https://stackoverflow.com/a/71193441
    * */
    function typeAction(node: HTMLInputElement) {
        node.type = type;
    }
</script>

<div class="fr-input-group" class:fr-input-group--error={error}>
    <label class="fr-label" for={id}>
        {label}
        <span class="fr-hint-text">{hint}</span>
    </label>
    <input
        class="fr-input"
        class:fr-input--error={error}
        type="text"
        {id}
        {name}
        {spellcheck}
        {autocomplete}
        {placeholder}
        bind:value
        {required}
        {disabled}
        use:typeAction
        aria-invalid={errorMsg ? "true" : undefined}
        aria-errormessage={errorMsg ? descErrorElement : undefined}
        {onblur}
        {oninput}
        {onchange} />
    {#if error && errorMsg}
        <p id={descErrorElement} class="fr-error-text">{errorMsg}</p>
    {/if}
</div>

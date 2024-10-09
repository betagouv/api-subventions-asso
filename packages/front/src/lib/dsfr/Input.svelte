<script lang="ts">
    import { nanoid } from "nanoid";

    export let label;
    export let value;
    export let id = nanoid(7);
    export let required = false;
    export let disabled = false;
    export let type = "text";
    export let name = `input-${id}`;
    export let autocomplete = "false";
    export let placeholder = "";
    export let error = "";
    export let errorMsg: string | null = null;
    export let hint = "";

    let spellcheck = true;

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
    function typeAction(node) {
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
        on:blur
        on:input
        on:change />
    {#if error && errorMsg}
        <p id={descErrorElement} class="fr-error-text">{errorMsg}</p>
    {/if}
</div>

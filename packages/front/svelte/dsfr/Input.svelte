<script>
    import { nanoid } from "nanoid";

    export let label;
    export let value;
    export let id = nanoid(7);
    export let required = false;
    export let type = "text";
    export let name = `input-${id}`;
    export let autocomplete = "false";
    export let placeholder = "";
    export let error = false;
    export let errorMsg = null;

    let spellcheck = true;

    // DSFR best practices
    if (["given-name", "family-name"].includes(name)) {
        spellcheck = false;
    }

    // define validation class
    let inputGroupClasses = "fr-input-group";
    let inputClasses = "fr-input";
    if (error) {
        inputGroupClasses = inputGroupClasses.concat(" ", "fr-input-group--error");
        inputClasses = inputClasses.concat(" ", "fr-input--error");
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

<div class={inputGroupClasses}>
    <label class="fr-label" for={name}>{label}</label>
    <input
        class={inputClasses}
        type="text"
        {id}
        {name}
        {spellcheck}
        {autocomplete}
        {placeholder}
        bind:value
        required={required ? "required" : undefined}
        use:typeAction
        aria-describedby={errorMsg ? "text-input-error-desc-error" : undefined} />
    {#if error && errorMsg}
        <p id="text-input-error-desc-error" class="fr-error-text">{errorMsg}</p>
    {/if}
</div>

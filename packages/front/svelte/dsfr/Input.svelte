<script>
    export let label;
    export let value;
    export let id;
    export let required = false;
    export let type = "text";
    export let name = `input-${id}`;
    export let autocomplete = "false";

    let spellcheck = true;

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

<div class="fr-input-group">
    <label class="fr-label" for={name}>{label}</label>
    <input
        class="fr-input"
        type="text"
        {id}
        {name}
        {spellcheck}
        {autocomplete}
        bind:value
        required={required ? "required" : undefined}
        use:typeAction />
</div>

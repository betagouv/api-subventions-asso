<script>
    export let label;
    export let value;
    export let id = "0";
    export let required = false;
    export let type = "text";

    const name = `input-text-${id}`;

    /*
    svelte needs to know beforehand the input type to manage reactivity
    use:typeAction is a workaround
    cf https://stackoverflow.com/a/71193441
    * */
    function typeAction(node) {
        node.type = type;
    }
</script>

<label class="fr-label" for={name}>{label}</label>
<input
    class="fr-input"
    type="text"
    id={name}
    {name}
    bind:value
    required={required ? "required" : undefined}
    use:typeAction />

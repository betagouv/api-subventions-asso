<script>
    export let label;
    export let value;
    export let id = "0";

    const name = `input-text-${id}`;
</script>

<label class="fr-label" for={name}>{label}</label>
<input class="fr-input" type="text" id={name} name={name} bind:value>
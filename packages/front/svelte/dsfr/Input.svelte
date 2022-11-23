<script>
    import { isBoolean } from "../helpers/validatorHelper";


    export let label;
    export let id = "0";
    export let value;
    export let valid = undefined;

    $: displayStateColor = isBoolean(valid) && value
    $: validationClass = `fr-input--${valid ? "valid" : "error"}`
    $: inputClass = displayStateColor

    const name = `input-text-${id}`;
</script>

<label class="fr-label" for={name}>{label}</label>
<input class={`fr-input ${validationClass}`} type="text" id={name} name={name} bind:value>
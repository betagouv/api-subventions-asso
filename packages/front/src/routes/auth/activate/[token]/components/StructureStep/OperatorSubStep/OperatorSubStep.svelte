<script>
    import Input from "$lib/dsfr/Input.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent
    // export let valid

    export let values = {
        operatorStructure: "",
    };
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element fr-mt-4v">
        <Input
            id="operator-input"
            type="text"
            label="Pour quel opérateur de l’État travaillez-vous ?"
            bind:value={values.operatorStructure}
            placeholder="Ex : ANCT" />
    </div>
</fieldset>

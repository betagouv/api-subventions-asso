<script>
    import CentralSubStepController from "./CentralSubStep.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import AutocompleteSelect from "$lib/components/AutocompleteSelect/AutocompleteSelect.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent
    // export let valid

    export let values;
    export let agentType;

    const ctrl = new CentralSubStepController();
    const { options } = ctrl;

    ctrl.init(agentType);
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element fr-mt-4v">
        <AutocompleteSelect
            options={$options}
            bind:value={values.structure}
            label="Dans quelle administration centrale travaillez-vous ?"
            placeholder="Ex : DIHAL (texte en autocomplétion)" />
    </div>
</fieldset>

<script lang="ts">
    import CentralSubStepController from "./CentralSubStep.controller";
    import AutocompleteSelect from "$lib/components/AutocompleteSelect/AutocompleteSelect.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent
    // export let valid

    export let values = { structure: "" };

    const ctrl = new CentralSubStepController();
    const { options } = ctrl;

    ctrl.init();
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <AutocompleteSelect
            options={$options}
            bind:value={values.structure}
            label="Dans quelle administration centrale travaillez-vous ?"
            on:change
            placeholder="Ex : DIHAL" />
    </div>
</fieldset>

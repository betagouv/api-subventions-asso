<script>
    import ExampleSubStepController from "./ExampleSubStep.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import AutocompleteSelect from "$lib/components/AutocompleteSelect/AutocompleteSelect.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent
    // export let valid

    export let values;
    // allows the substep to make the calls to the API to fill autocomplete fields
    // the call is not made by the parent because half substeps don't need it
    export let agentType;

    const ctrl = new ExampleSubStepController();
    const { options } = ctrl;

    ctrl.init(agentType);
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element fr-mt-4v">
        <Input id="some-input" type="text" label="Je suis un champ libre" bind:value={values.example} />
    </div>
</fieldset>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element fr-mt-4v">
        <AutocompleteSelect options={$options} bind:value={values.structure} label="Structure" />
    </div>
</fieldset>

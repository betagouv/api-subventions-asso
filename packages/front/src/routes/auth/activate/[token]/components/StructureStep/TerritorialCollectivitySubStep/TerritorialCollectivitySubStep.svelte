<script>
    import TerritorialCollectivitySubStepController from "./TerritorialCollectivitySubStep.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import Radio from "$lib/dsfr/Radio.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent
    // export let valid

    export let values;

    const ctrl = new TerritorialCollectivitySubStepController();
</script>

<Radio options={ctrl.scopeOptions} label="Sélectionnez votre périmètre :" bind:value={values.territorialScope} />

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element fr-mt-4v">
        <Input
            id="territorialStructure"
            type="text"
            label="Pour quelle collectivité territoriale travaillez-vous ?"
            bind:value={values.territorialStructure} />
    </div>
</fieldset>

<script>
    import { AdminTerritorialLevel } from "dto";
    import DecentralizedSubStepController from "./DecentralizedSubStep.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import AutocompleteSelect from "$lib/components/AutocompleteSelect/AutocompleteSelect.svelte";
    import Radio from "$lib/dsfr/Radio.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent
    // export let valid

    export let values = {
        decentralizedLevel: "",
        decentralizedTerritory: "",
        decentralizedStructure: "",
    };
    // allows the substep to make the calls to the API to fill autocomplete fields
    // the call is not made by the parent because half substeps don't need it
    export let agentType;

    const ctrl = new DecentralizedSubStepController();
    const { departmentOptions, regionOptions, structureOptions } = ctrl;

    ctrl.init(agentType);
</script>

<Radio
    options={ctrl.levelOptions}
    label="Vous êtes :"
    bind:value={values.decentralizedLevel}
    on:change={({ detail }) => ctrl.onChoosingLevel(detail)} />

<fieldset class="fr-fieldset">
    {#if values.decentralizedLevel === AdminTerritorialLevel.OVERSEAS}
        <div class="fr-fieldset__element fr-mb-4v">
            <Input
                id="territory"
                type="text"
                label="Quelle est votre collectivité d'outre-mer à statut particulier ?"
                placeholder="Ex : Collectivité de Saint Martin"
                bind:value={values.decentralizedTerritory} />
        </div>
    {:else if values.decentralizedLevel === AdminTerritorialLevel.DEPARTMENTAL}
        <div class="fr-fieldset__element fr-mb-4v">
            <AutocompleteSelect
                options={$departmentOptions}
                bind:value={values.decentralizedTerritory}
                label="Quel est votre département ?"
                placeholder="Ex : 01 - Ain" />
        </div>
    {:else if values.decentralizedLevel === AdminTerritorialLevel.REGIONAL}
        <div class="fr-fieldset__element fr-mb-4v">
            <AutocompleteSelect
                options={$regionOptions}
                bind:value={values.decentralizedTerritory}
                label="Quelle est votre région"
                placeholder="Ex : Occitanie" />
        </div>
    {/if}

    <div class="fr-fieldset__element">
        {#if values.decentralizedLevel === AdminTerritorialLevel.REGIONAL || values.decentralizedLevel === AdminTerritorialLevel.DEPARTMENTAL}
            <AutocompleteSelect
                options={$structureOptions}
                bind:value={values.decentralizedStructure}
                label="Quel est votre administration ?"
                placeholder="Ex : DETS59, Préfecture" />
        {:else}
            <Input
                id="structure"
                type="text"
                bind:value={values.decentralizedStructure}
                label="Quel est votre administration ?"
                placeholder="Ex : DETS59, Préfecture" />
        {/if}
    </div>
</fieldset>

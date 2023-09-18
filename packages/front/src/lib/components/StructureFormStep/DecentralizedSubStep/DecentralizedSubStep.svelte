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
        structure: "",
    };

    const ctrl = new DecentralizedSubStepController();
    const { departmentOptions, regionOptions, structureOptions } = ctrl;

    ctrl.init(values);
</script>

<Radio
    options={ctrl.levelOptions}
    label="Vous êtes :"
    bind:value={values.decentralizedLevel}
    on:change={({ detail }) => ctrl.onChoosingLevel(detail)} />

<fieldset class="fr-fieldset">
    {#if values.decentralizedLevel === AdminTerritorialLevel.DEPARTMENTAL}
        <div class="fr-fieldset__element fr-mb-4v">
            <AutocompleteSelect
                options={$departmentOptions}
                bind:value={values.decentralizedTerritory}
                label="Quel est votre département ?"
                on:change
                placeholder="Ex : 01 - Ain" />
        </div>
    {:else if values.decentralizedLevel === AdminTerritorialLevel.REGIONAL}
        <div class="fr-fieldset__element fr-mb-4v">
            <AutocompleteSelect
                options={$regionOptions}
                bind:value={values.decentralizedTerritory}
                label="Quelle est votre région"
                on:change
                placeholder="Ex : Occitanie" />
        </div>
    {/if}

    <div class="fr-fieldset__element">
        {#if values.decentralizedLevel === AdminTerritorialLevel.REGIONAL || values.decentralizedLevel === AdminTerritorialLevel.DEPARTMENTAL}
            <AutocompleteSelect
                options={$structureOptions}
                bind:value={values.structure}
                label="Quelle est votre administration ?"
                on:change
                placeholder="Ex : DETS59, Préfecture" />
        {:else}
            <Input
                id="structure"
                type="text"
                bind:value={values.structure}
                label="Quelle est votre administration ?"
                on:change
                placeholder="Ex : DETS59, Préfecture" />
        {/if}
    </div>
</fieldset>

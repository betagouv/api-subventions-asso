<script lang="ts">
    import { AdminTerritorialLevel } from "dto";
    import DecentralizedSubStepController from "./DecentralizedSubStep.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import AutocompleteSelect from "$lib/components/AutocompleteSelect/AutocompleteSelect.svelte";
    import Radio from "$lib/dsfr/Radio.svelte";
    import RegionField from "$lib/components/StructureFormStep/RegionField/RegionField.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent

    interface Props {
        // export let valid
        values?: {
            decentralizedLevel: string;
            decentralizedTerritory: string;
            structure: string;
        };
        onchange?: () => void;
    }

    let {
        values = $bindable({
            decentralizedLevel: "",
            decentralizedTerritory: "",
            structure: "",
        }),
        onchange = () => {},
    }: Props = $props();

    const ctrl = new DecentralizedSubStepController(onchange);
    const { departmentOptions, structureOptions } = ctrl;

    ctrl.init(values);
</script>

<Radio
    options={ctrl.levelOptions}
    label="Sélectionnez votre périmètre :"
    bind:value={values.decentralizedLevel}
    onchange={detail => ctrl.onChoosingLevel(detail)} />

<fieldset class="fr-fieldset">
    {#if values.decentralizedLevel === AdminTerritorialLevel.DEPARTMENTAL}
        <div class="fr-fieldset__element fr-mb-4v">
            <AutocompleteSelect
                options={$departmentOptions}
                bind:value={values.decentralizedTerritory}
                label="Quel est votre département ?"
                {onchange}
                placeholder="Ex : 01 - Ain" />
        </div>
    {:else if values.decentralizedLevel === AdminTerritorialLevel.REGIONAL}
        <div class="fr-fieldset__element fr-mb-4v">
            <RegionField bind:value={values.decentralizedTerritory} label="Quelle est votre région ?" />
        </div>
    {/if}

    <div class="fr-fieldset__element">
        {#if values.decentralizedLevel === AdminTerritorialLevel.REGIONAL || values.decentralizedLevel === AdminTerritorialLevel.DEPARTMENTAL}
            <AutocompleteSelect
                options={$structureOptions}
                bind:value={values.structure}
                label="Quelle est votre administration ?"
                {onchange}
                placeholder="Ex : DDETS59, Préfecture" />
        {:else}
            <Input
                id="structure"
                type="text"
                bind:value={values.structure}
                label="Quelle est votre administration ?"
                {onchange}
                placeholder="Ex : DDETS59, Préfecture" />
        {/if}
    </div>
</fieldset>

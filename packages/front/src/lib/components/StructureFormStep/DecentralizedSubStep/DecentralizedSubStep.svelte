<script lang="ts">
    import { AdminTerritorialLevel } from "dto";
    import DecentralizedSubStepController from "./DecentralizedSubStep.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import AutocompleteSelect from "$lib/components/AutocompleteSelect/AutocompleteSelect.svelte";
    import Radio from "$lib/dsfr/Radio.svelte";
    import RegionField from "$lib/components/StructureFormStep/RegionField/RegionField.svelte";
    import type { Option } from "$lib/types/FieldOption";

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

    const ctrl = new DecentralizedSubStepController(() => onchange());
    const { departmentOptions, structureOptions } = ctrl;
    let decentralizedLevel = $derived(values.decentralizedLevel);
    let decentralizedTerritory = $derived(values.decentralizedTerritory);
    let structure = $derived(values.structure);

    function syncValues() {
        values.decentralizedLevel = decentralizedLevel;
        values.decentralizedTerritory = decentralizedTerritory;
        values.structure = structure;
    }

    function notifyChange() {
        syncValues();
        onchange();
    }

    function chooseLevel(detail: Option<AdminTerritorialLevel>) {
        syncValues();
        ctrl.onChoosingLevel(detail);
    }

    ctrl.init(values);
</script>

<Radio
    options={ctrl.levelOptions}
    label="Sélectionnez votre périmètre :"
    bind:value={decentralizedLevel}
    onchange={detail => chooseLevel(detail)} />

<fieldset class="fr-fieldset">
    {#if decentralizedLevel === AdminTerritorialLevel.DEPARTMENTAL}
        <div class="fr-fieldset__element fr-mb-4v">
            <AutocompleteSelect
                options={$departmentOptions}
                bind:value={decentralizedTerritory}
                label="Quel est votre département ?"
                onchange={() => notifyChange()}
                placeholder="Ex : 01 - Ain" />
        </div>
    {:else if decentralizedLevel === AdminTerritorialLevel.REGIONAL}
        <div class="fr-fieldset__element fr-mb-4v">
            <RegionField
                bind:value={decentralizedTerritory}
                label="Quelle est votre région ?"
                onchange={() => notifyChange()} />
        </div>
    {/if}

    <div class="fr-fieldset__element">
        {#if decentralizedLevel === AdminTerritorialLevel.REGIONAL || decentralizedLevel === AdminTerritorialLevel.DEPARTMENTAL}
            <AutocompleteSelect
                options={$structureOptions}
                bind:value={structure}
                label="Quelle est votre administration ?"
                onchange={() => notifyChange()}
                placeholder="Ex : DDETS59, Préfecture" />
        {:else}
            <Input
                id="structure"
                type="text"
                bind:value={structure}
                label="Quelle est votre administration ?"
                onchange={() => notifyChange()}
                placeholder="Ex : DDETS59, Préfecture" />
        {/if}
    </div>
</fieldset>

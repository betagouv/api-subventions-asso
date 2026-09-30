<script lang="ts">
    import CentralSubStepController from "./CentralSubStep.controller";
    import AutocompleteSelect from "$lib/components/AutocompleteSelect/AutocompleteSelect.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent

    interface Props {
        // export let valid
        values?: { structure: string };
        onchange?: () => void;
    }

    let { values = $bindable({ structure: "" }), onchange = () => {} }: Props = $props();

    const ctrl = new CentralSubStepController();
    const { options } = ctrl;
    let structure = $derived(values.structure);

    function notifyChange() {
        values.structure = structure;
        onchange();
    }

    ctrl.init();
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <AutocompleteSelect
            options={$options}
            bind:value={structure}
            label="Dans quelle administration centrale travaillez-vous ?"
            onchange={() => notifyChange()}
            placeholder="Ex : DIHAL" />
    </div>
</fieldset>

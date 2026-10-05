<script lang="ts">
    import TerritorialCollectivitySubStepController from "./TerritorialCollectivitySubStep.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import Radio from "$lib/dsfr/Radio.svelte";
    import RegionField from "$lib/components/StructureFormStep/RegionField/RegionField.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent

    interface Props {
        // export let valid
        values?: {
            structure: string;
            territorialScope: string;
            region: string;
        };
        onchange?: () => void;
    }

    let {
        values = $bindable({
            structure: "",
            territorialScope: "",
            region: "",
        }),
        onchange = () => {},
    }: Props = $props();

    const ctrl = new TerritorialCollectivitySubStepController();
    let territorialScope = $derived(values.territorialScope);
    let structure = $derived(values.structure);
    let region = $derived(values.region);

    function notifyChange() {
        values.territorialScope = territorialScope;
        values.structure = structure;
        values.region = region;
        onchange();
    }
</script>

<Radio
    options={ctrl.scopeOptions}
    label="Sélectionnez votre périmètre :"
    bind:value={territorialScope}
    onchange={() => notifyChange()} />

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element fr-mt-4v">
        <Input
            id="territorialStructure"
            type="text"
            label="Pour quelle collectivité territoriale travaillez-vous ?"
            placeholder="Ex : Ville de Paris, Département des Landes, Communauté de Communes Terre d'Auge..."
            bind:value={structure}
            onchange={() => notifyChange()} />
    </div>

    <div class="fr-fieldset__element fr-mt-4v">
        <RegionField
            bind:value={region}
            label="Dans quelle région se trouve votre collectivité ?"
            onchange={() => notifyChange()} />
    </div>
</fieldset>

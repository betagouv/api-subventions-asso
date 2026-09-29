<script lang="ts">
    import Input from "$lib/dsfr/Input.svelte";
    import RegionField from "$lib/components/StructureFormStep/RegionField/RegionField.svelte";

    // when we will do validation, the substep will send the conclusion
    // about allowing to submit in this variable that should be bound by the parent

    interface Props {
        // export let valid
        values?: {
            structure: string;
            region: string;
        };
        onchange?: () => void;
    }

    let {
        values = $bindable({
            structure: "",
            region: "",
        }),
        onchange = () => {},
    }: Props = $props();
    let structure = $derived(values.structure);
    let region = $derived(values.region);

    function notifyChange() {
        values.structure = structure;
        values.region = region;
        onchange();
    }
</script>

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <Input
            id="operator-input"
            type="text"
            label="Pour quel opérateur de l’État travaillez-vous ?"
            bind:value={structure}
            onchange={() => notifyChange()}
            placeholder="Ex : ANCT" />
    </div>

    <div class="fr-fieldset__element fr-mt-4v">
        <RegionField
            bind:value={region}
            label="Si vous travaillez à un échelon départemental ou régional, merci d'indiquer la région dans lequel se trouve votre opérateur :"
            hint="Si vous travaillez en administration centrale, merci de laisser le champ libre"
            onchange={() => notifyChange()} />
    </div>
</fieldset>

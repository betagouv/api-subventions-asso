<script lang="ts">
    import { onMount } from "svelte";
    import AutocompleteSelect from "$lib/components/AutocompleteSelect/AutocompleteSelect.svelte";
    import RegionFieldController from "$lib/components/StructureFormStep/RegionField/RegionFieldController.js";

    interface Props {
        value: string;
        label?: string;
        hint?: string;
    }

    let { value = $bindable(), label = "Quelle est votre région ?", hint = "" }: Props = $props();
    let element = $state();

    const ctrl = new RegionFieldController();
    const { regionOptions } = ctrl;

    onMount(() => ctrl.onMount(element));
</script>

<div class="container" bind:this={element}>
    <AutocompleteSelect options={$regionOptions} bind:value {label} onchange placeholder="Ex : Occitanie" {hint} />
</div>

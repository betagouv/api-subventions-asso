<script lang="ts">
    import { onMount } from "svelte";
    import AutocompleteSelect from "$lib/components/AutocompleteSelect/AutocompleteSelect.svelte";
    import RegionFieldController from "$lib/components/StructureFormStep/RegionField/RegionFieldController.js";

    export let value;
    export let label = "Quelle est votre région ?";
    let element;

    const ctrl = new RegionFieldController();
    const { regionOptions } = ctrl;

    onMount(() => ctrl.onMount(element));
</script>

<div class="container" bind:this={element}>
    <AutocompleteSelect options={$regionOptions} bind:value {label} on:change placeholder="Ex : Occitanie" />
</div>

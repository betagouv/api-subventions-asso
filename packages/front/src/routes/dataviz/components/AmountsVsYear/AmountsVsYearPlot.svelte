<script lang="ts">
    import { onMount } from "svelte";
    import type { PartialAmountsVsProgramRegionDto } from "../../@types/AmountsVsYear.types";
    import { updateChart } from "./AmountsVsYear.helper";

    export let data_all: PartialAmountsVsProgramRegionDto[];
    export let data_selected: PartialAmountsVsProgramRegionDto[];

    let svg: SVGSVGElement;
    const width = 800;
    const height = 400;

    const margin = { top: 80, right: 320, bottom: 40, left: 90 };

    onMount(() => updateChart(svg, data_all, data_selected, width, height, margin));

    $: updateChart(svg, data_all, data_selected, width, height, margin);
</script>

<svg bind:this={svg} />

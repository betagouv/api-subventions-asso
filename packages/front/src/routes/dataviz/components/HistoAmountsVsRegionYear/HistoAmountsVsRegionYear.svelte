<script lang="ts">
    import { onMount } from "svelte";
    import type { AmountsVsProgramRegionDto } from "dto";
    import { createHistoAmountsVsRegionYear } from "./HistoAmountsVsRegionYear.helper";
    import { HistoAmountsVsRegionYearController } from "./HistoAmountsVsRegionYear.controller";

    export let elements: AmountsVsProgramRegionDto[];

    let svg: SVGSVGElement;
    const width = 1300;
    const height = 500;

    const margin = { top: 80, right: 320, bottom: 110, left: 90 };

    const controller = new HistoAmountsVsRegionYearController(elements);
    const { dataHisto } = controller;

    onMount(() => createHistoAmountsVsRegionYear(svg, dataHisto, width, height, margin));

    $: createHistoAmountsVsRegionYear(svg, dataHisto, width, height, margin);
</script>

<svg bind:this={svg} />

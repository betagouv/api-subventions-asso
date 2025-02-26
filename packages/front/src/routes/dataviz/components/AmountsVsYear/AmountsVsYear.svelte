<script lang="ts">
    import type { AmountsVsProgramRegionDto } from "dto";
    import { AmountsVsYearController } from "./AmountsVsYear.controller";
    import AmountsVsYearPlot from "./AmountsVsYearPlot.svelte";
    import Select from "$lib/dsfr/Select.svelte";

    export let elements: AmountsVsProgramRegionDto[];

    const controller = new AmountsVsYearController(elements);
    const { selectedRegion, selectedProgram, regionOptions, programOptions, filteredData, dataYear } = controller;
</script>

<div class="fr-grid-row flex space-between">
    <div class="fr-col-5">
        <Select bind:selected={$selectedRegion} options={regionOptions} label={"Attachement comptable"} />
    </div>

    <div class="fr-col-6">
        <Select bind:selected={$selectedProgram} options={programOptions} label={"Programme"} />
    </div>
</div>
<div class="fr-grid-row">
    <AmountsVsYearPlot data_year={dataYear} data_selected={$filteredData} />
</div>

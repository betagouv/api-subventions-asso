<script lang="ts">
    import type { AmountsVsProgramRegionDto } from "dto";
    import { AmountsVsYearController } from "./AmountsVsYear.controller";
    import Select from "$lib/dsfr/Select.svelte";
    import AmountsVsYearPlot from "./AmountsVsYearPlot.svelte";


    export let elements : AmountsVsProgramRegionDto[]; // amountsVsProgramRegion
    
    const grapheId = "graph-amounts-vs-year";

    const controller = new AmountsVsYearController(elements);
    const {selectedExercise, selectedRegion, selectedProgram, exerciseOptions, regionOptions, programOptions, filteredData} = controller;
    console.log("filteredData")
    console.log($filteredData);
</script>
<div class="fr-grid-row flex space-between">
    <div class ="fr-col-3">
        <Select bind:selected={$selectedExercise} options={exerciseOptions} label={"Exercice"}/>
    </div>
    <div class ="fr-col-5">
        <Select bind:selected={$selectedRegion} options={regionOptions} label={"Attachement comptable"}/>
    </div>

    <div class ="fr-col-3">
        <Select bind:selected={$selectedProgram} options={programOptions} label={"Programme"}/>
    </div>
    <AmountsVsYearPlot data_year={elements} data_selected={filteredData} />
</div>



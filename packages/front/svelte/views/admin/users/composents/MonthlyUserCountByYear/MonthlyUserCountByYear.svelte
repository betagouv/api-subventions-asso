<script>
    import { onMount } from "svelte";
    import { MonthlyUserCountByYearController } from "./MonthlyUserCountByYear.controller";
    import ErrorAlert from "../../../../../components/ErrorAlert.svelte";
    import Spinner from "../../../../../components/Spinner.svelte";
    import Select from "../../../../../dsfr/Select.svelte";

    let canvas;

    const ctrl = new MonthlyUserCountByYearController();
    ctrl.init();

    onMount(() => ctrl.onMount(canvas));
</script>

<div class="fr-grid-row" hidden={!ctrl.data}>
    <div class="fr-col-8">
        <Select
            on:change={e => ctrl.updateYear(e.detail)}
            label="Année"
            options={ctrl.years}
            selected={ctrl.defaultYear} />
        <div class="chart-container">
            <canvas bind:this={canvas} />
        </div>
    </div>
    <div class="fr-col-4" />
</div>
{#await ctrl.dataPromise}
    <Spinner description="Chargement des données en cours..." />
{:catch error}
    <ErrorAlert message={error.message} />
{/await}

<style>
    .chart-container {
        position: relative;
        width: 100%;
        height: 18rem;
    }
</style>

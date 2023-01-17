<script>
    import { MonthlyUserCountByYearController } from "./MonthlyUserCountByYear.controller";
    import ErrorAlert from "../../../../../components/ErrorAlert.svelte";
    import Spinner from "../../../../../components/Spinner.svelte";
    import Select from "../../../../../dsfr/Select.svelte";

    let canvas;

    const ctrl = new MonthlyUserCountByYearController();
    ctrl.init();
    const { year, progress, dataPromise, message } = ctrl;

    $: ctrl.onCanvasMount(canvas);
</script>

<div class="stat-container">
    {#await $dataPromise}
        <Spinner description="Chargement des données en cours..." />
    {:then data}
        <div class="fr-grid-row">
            <div class="fr-col-9 fr-pr-10w">
                <Select
                    on:change={e => ctrl.updateYear(e.detail)}
                    label="Année"
                    options={ctrl.yearOptions}
                    bind:selected={$year} />
                <div class="chart-container">
                    <canvas bind:this={canvas} />
                </div>
            </div>
            <div class="fr-col-3">
                <div class="fr-mb-5w">
                    <div class="fr-text--bold fr-text--xl fr-mb-0">+{$progress}</div>
                    <div class="fr-text--xs">Nouveaux utilisateurs {$message}</div>
                </div>
            </div>
        </div>
    {:catch error}
        <ErrorAlert message={error.message} />
    {/await}
</div>

<style>
    .chart-container {
        position: relative;
        width: 100%;
        height: 18rem;
    }

    .stat-container {
        height: 24rem; /* to prevent box resizing when changing year */
    }
</style>

<script>
    import { MonthlyGraphController } from "./MonthlyGraph.controller";
    import ErrorAlert from "@components/ErrorAlert.svelte";
    import Spinner from "@components/Spinner.svelte";
    import Select from "@dsfr/Select.svelte";
    import Widget from "@components/Widget.svelte";

    let canvas;
    export let loadData;
    export let title = "";

    const ctrl = new MonthlyGraphController(loadData, title);
    ctrl.init();
    const { year, dataPromise } = ctrl;

    $: ctrl.onCanvasMount(canvas);
</script>

<Widget title={ctrl.title}>
    <div class="stat-container">
        {#await $dataPromise}
            <Spinner description="Chargement des données en cours..." />
        {:then { aggregateStats }}
            <div class="fr-grid-row">
                <div class="fr-col-9 fr-pr-10w">
                    <Select
                        id={title}
                        on:change={e => ctrl.updateYear(e.detail)}
                        label="Année"
                        options={ctrl.yearOptions}
                        bind:selected={$year} />
                    <div class="chart-container">
                        <canvas bind:this={canvas} />
                    </div>
                </div>
                <div class="fr-col-3">
                    {#each aggregateStats as stat}
                        <div class="fr-mb-5w">
                            <div class="fr-text--bold fr-text--xl fr-mb-0">{stat.value}</div>
                            <div class="fr-text--xs">{stat.message}</div>
                        </div>
                    {/each}
                </div>
            </div>
        {:catch error}
            <ErrorAlert message={error.message} />
        {/await}
    </div>
</Widget>

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

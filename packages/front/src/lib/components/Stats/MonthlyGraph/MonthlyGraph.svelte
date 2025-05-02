<script>
    import { MonthlyGraphController } from "./MonthlyGraph.controller";
    import ErrorAlert from "$lib/components/ErrorAlert.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import Select from "$lib/dsfr/Select.svelte";
    import Widget from "$lib/components/Widget.svelte";
    import MonthlyGraphTooltip from "$lib/components/Stats/MonthlyGraphTooltip/MonthlyGraphTooltip.svelte";

    let canvas;
    let tooltip;
    export let loadData;
    export let title = "";
    export let resourceName = "";
    export let withPreviousValue = false;

    const ctrl = new MonthlyGraphController(loadData, title, resourceName, withPreviousValue);
    ctrl.init();
    const { year, dataPromise, yearOptions } = ctrl;

    $: if (canvas && tooltip) ctrl.onCanvasMount(canvas, tooltip);
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
                        options={yearOptions}
                        bind:selected={$year}
                        narrow />
                    <div class="chart-container">
                        <MonthlyGraphTooltip
                            bind:this={tooltip}
                            resource={ctrl.resourceName}
                            year={$year}
                            {withPreviousValue} />
                        <canvas
                            bind:this={canvas}
                            aria-label="Graphique des {resourceName} par mois sur l'année {$year}">
                            <!-- TODO fallback content for accessibility -->
                        </canvas>
                    </div>
                </div>
                <div class="fr-col-3">
                    {#each aggregateStats as stat, index (index)}
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

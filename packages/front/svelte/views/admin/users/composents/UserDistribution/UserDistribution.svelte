<script>
    import Widget from "@components/Widget.svelte";
    import Spinner from "@components/Spinner.svelte";
    import UserDistributionController from "./UserDistribution.controller";

    let canvas;
    const controller = new UserDistributionController();
    const promise = controller.init();

    const { data } = controller;

    $: controller.canvas = canvas;
</script>

<Widget title="Répartition des utilisateurs :">
    {#await promise}
        <Spinner description="Chargement des données en cours ..." />
    {:then _}
        <div class="chart-container">
            <canvas bind:this={canvas} />
        </div>
        <div class="fr-mt-5v">
            <div class="flex column">
                <span class="rectangle flex active fr-text--bold align-center fr-mt-3v">{$data.active.value}</span>
                <span class="fr-mt-3v">{$data.active.label}</span>
            </div>
            <div class="flex column">
                <span class="rectangle flex idle fr-text--bold align-center fr-mt-3v">{$data.idle.value}</span>
                <span class="fr-mt-3v">{$data.idle.label}</span>
            </div>
            <div class="flex column">
                <span class="rectangle flex inactive fr-text--bold align-center fr-mt-3v">{$data.inactive.value}</span>
                <span class="fr-mt-3v">{$data.inactive.label}</span>
            </div>
            <div class="flex column">
                <span class="rectangle flex admin fr-text--bold align-center fr-mt-3v">{$data.admin.value}</span>
                <span class="fr-mt-3v">{$data.admin.label}</span>
            </div>
        </div>
    {/await}
</Widget>

<style>
    .chart-container {
        margin: auto;
        width: 339px;
        height: 339px;
    }

    .rectangle::before {
        width: 40px;
        height: 16px;
        content: "";
        margin-right: 10px;
    }

    .active::before {
        background-color: var(--background-action-low-blue-ecume);
    }

    .admin::before {
        background-color: var(--background-alt-purple-glycine);
    }

    .idle::before {
        background-color: var(--background-action-high-blue-cumulus);
    }

    .inactive::before {
        background-color: var(--background-alt-pink-tuile);
    }
</style>

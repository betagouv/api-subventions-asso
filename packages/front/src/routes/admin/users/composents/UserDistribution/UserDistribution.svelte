<script>
    import UserDistributionController from "./UserDistribution.controller";
    import Widget from "$lib/components/Widget.svelte";
    import Spinner from "$lib/components/Spinner.svelte";

    let canvas;
    const controller = new UserDistributionController();
    const promise = controller.init();

    const { distributions } = controller;

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
            {#each $distributions as distribution}
                <div class="flex column">
                    <span class="rectangle flex fr-text--bold align-center fr-mt-3v {distribution.name}">
                        {distribution.value}
                    </span>
                    <span class="fr-mt-3v">{distribution.label}</span>
                </div>
            {/each}
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

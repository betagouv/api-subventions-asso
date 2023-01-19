<script>
    import Widget from "@components/Widget.svelte";
    import Spinner from "@components/Spinner.svelte";
    import UserDistributionController from "./UserDistribution.controller";

    let canvas;
    const controller = new UserDistributionController();
    const promise = controller.init();

    const { admin, idle, active, inactive } = controller;

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
                <span class="rectangle flex active fr-text--bold align-center fr-mt-3v">{$active}</span>
                <span class="fr-mt-3v">Utilisateurs actif (hors admin)</span>
            </div>
            <div class="flex column">
                <span class="rectangle flex idle fr-text--bold align-center fr-mt-3v">{$idle}</span>
                <span class="fr-mt-3v">Utilisateurs non actifs (hors admin)</span>
            </div>
            <div class="flex column">
                <span class="rectangle flex inactive fr-text--bold align-center fr-mt-3v">{$inactive}</span>
                <span class="fr-mt-3v">Utilisateurs n'ayant pas activer leurs comptes (hors admin)</span>
            </div>
            <div class="flex column">
                <span class="rectangle flex admin fr-text--bold align-center fr-mt-3v">{$admin}</span>
                <span class="fr-mt-3v">Administrateurs</span>
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

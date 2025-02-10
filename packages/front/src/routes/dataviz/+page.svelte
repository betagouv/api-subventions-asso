<script lang="ts">
    import TableAmountsVsProgramRegion from "./components/TableAmountsVsProgramRegion/TableAmountsVsProgramRegion.svelte";
    import { DataVizController } from "./DataViz.controller";
    import FullPageSpinner from "$lib/components/FullPageSpinner.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";

    const controller = new DataVizController();
    const { amountsVsProgramRegionData } = controller;
</script>

{#await amountsVsProgramRegionData}
    <FullPageSpinner description="Chargement des données en cours ..." />
{:then result}
    <div class="main-container">
        <div class="top-section">
            <div class="left-top">
                <h3>Montant des subventions que l'Etat a versées</h3>
                <TableAmountsVsProgramRegion elements={result} />
            </div>
            <div class="right-top">
                <h2>Construction graphe en cours</h2>
            </div>
        </div>
        <div class="bottom-section">
            <h2>Construction carte en cours</h2>
        </div>
    </div>
{:catch error}
    <Alert type="error" title="Erreur">
        {error.message}
    </Alert>
{/await}

<style>
    .main-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .top-section {
        display: flex;
        flex: 1;
    }

    .left-top {
        flex: 1;
        padding: 10px;
    }

    .right-top {
        flex: 1;
        padding: 10px;
    }

    .bottom-section {
        flex: 1;
        padding: 10px;
        background-color: lightgray;
    }
</style>

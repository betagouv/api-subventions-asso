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
    /* Conteneur principal - divisé en 2 parties horizontalement */
    .main-container {
        display: flex;
        flex-direction: column; /* Divise la page en 2 (haut et bas) */
        height: 100vh; /* Prend toute la hauteur de la fenêtre */
    }

    /* Partie supérieure de la page (divisée en 2 verticalement) */
    .top-section {
        display: flex;
        flex: 1; /* Prend la moitié de la hauteur */
    }

    /* Partie gauche de la section supérieure */
    .left-top {
        flex: 1;
        padding: 10px;
    }

    /* Partie droite de la section supérieure */
    .right-top {
        flex: 1; /* Prend l'autre moitié de la hauteur */
        padding: 10px;
    }

    /* Partie inférieure de la page */
    .bottom-section {
        flex: 1; /* Prend l'autre moitié de la hauteur */
        padding: 10px;
        background-color: lightgray; /* Pour visualiser l'élément */
    }
</style>

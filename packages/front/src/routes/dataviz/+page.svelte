<script lang="ts">
    import TableAmountsVsProgramRegion from "./components/TableAmountsVsProgramRegion/TableAmountsVsProgramRegion.svelte";
    import { DataVizController } from "./DataViz.controller";
    import FullPageSpinner from "$lib/components/FullPageSpinner.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";

    const controller = new DataVizController();
    const { amountsVsProgramRegionDataPromise } = controller;
</script>

{#await amountsVsProgramRegionDataPromise}
    <FullPageSpinner description="Chargement des données en cours ..." />
{:then result}
    <div class="fr-container">
        <div class="fr-grid-row">
            <div class="fr-col-6">
                <h2 class="fr-h4 text-center">Montant des subventions que l'Etat a versées</h2>

                <TableAmountsVsProgramRegion elements={result} />
            </div>
            <div class="fr-col-6">
                <h2 class="fr-h4 text-center">Construction graphe en cours</h2>
            </div>
        </div>
    </div>
{:catch error}
    <Alert type="error" title="Erreur">
        {error.message}
    </Alert>
{/await}

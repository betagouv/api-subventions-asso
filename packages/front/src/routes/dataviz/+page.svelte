<script lang="ts">
    import TableAmountsVsProgramRegion from "./components/TableAmountsVsProgramRegion/TableAmountsVsProgramRegion.svelte";
    import { DataVizController } from "./DataViz.controller";
    import AmountsVsYear from "./components/AmountsVsYear/AmountsVsYear.svelte";
    import FullPageSpinner from "$lib/components/FullPageSpinner.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";

    const controller = new DataVizController();
    const { amountsVsProgramRegionDataPromise } = controller;
</script>

{#await amountsVsProgramRegionDataPromise}
    <FullPageSpinner description="Chargement des données en cours ..." />
{:then result}
    <Alert type="warning">
        Ceci est une beta, les données présentes peuvent inclure des données de fondation. Nous nous efforçons de
        nettoyer les données rapidement.
    </Alert>

    <h2 class="fr-h4 text-center">Montant des subventions que l'Etat a versées</h2>
    <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-6">
                <TableAmountsVsProgramRegion elements={result} />
            </div>
            <div class="fr-col-6">
                <AmountsVsYear elements={result} />
            </div>
        </div>
    </div>
{:catch error}
    <Alert type="error" title="Erreur">
        {error.message}
    </Alert>
{/await}

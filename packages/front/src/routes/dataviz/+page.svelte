<script lang="ts">
    import TableAmountsVsProgramRegion from "./components/TableAmountsVsProgramRegion/TableAmountsVsProgramRegion.svelte";
    import { DataVizController } from "./DataViz.controller";
    import AmountsVsYear from "./components/AmountsVsYear/AmountsVsYear.svelte";
    import HistoAmountsVsRegionYear from "./components/HistoAmountsVsRegionYear/HistoAmountsVsRegionYear.svelte";
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

    <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-6">
                <h2 class="fr-h4">Montant des subventions que l'Etat a versé</h2>
                <TableAmountsVsProgramRegion elements={result} />
            </div>
            <div class="fr-col-6">
                <h2 class="fr-h4">Evolution des subventions versées :</h2>
                <p class="fr-h10">
                    comparaison de la tendance globale en bleu et de la tendance par région et/ou programme selectionné
                    en rouge. Attention, les deux courbes n'ont pas la même échelle.
                </p>
                <AmountsVsYear elements={result} />
            </div>
            <div class="fr-col-12">
                <h2 class="fr-h4">Evolution des subventions versées selon la société de rattachement comptable.</h2>
                <HistoAmountsVsRegionYear elements={result} />
            </div>
        </div>
    </div>
{:catch error}
    <Alert type="error" title="Erreur">
        {error.message}
    </Alert>
{/await}

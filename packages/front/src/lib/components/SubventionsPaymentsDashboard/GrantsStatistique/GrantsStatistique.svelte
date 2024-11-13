<script>
    import SubventionsPaymentsStatistiqueController from "./GrantsStatistique.controller";

    export let grants;
    export let year;

    const controller = new SubventionsPaymentsStatistiqueController(grants);

    const { paymentsAmount, paymentsRepartition } = controller;

    $: grants, controller.updateElements(grants);
</script>

<p class="text--xxl fr-mb-1w">
    Total des versements réalisés en {year} :
    <b>{$paymentsAmount}</b>
</p>
{#if $paymentsRepartition}
    <p class="fr-text--lg">
        Répartis entre {$paymentsRepartition?.paid} des {$paymentsRepartition?.total} établissements liés à l'association.
    </p>
{/if}
<div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
    <div class="fr-col-9">
        <h3 class="fr-h4 fr-mb-1w">Demandes de subventions collectées</h3>
        <p class="asterisk fr-text--sm">
            Certaines informations et données peuvent être manquantes car elles n’ont pas encore été rattachées au
            service.
        </p>
    </div>
    <div class="fr-col-3">
        <h3 class="fr-h4">Versements réalisés</h3>
    </div>
</div>

<style>
    .asterisk {
        font-weight: bold;
        font-style: italic;
    }

    .text--xxl {
        font-size: 1.5rem;
    }
</style>

<script>
    import SubventionsPaymentsStatistiqueController from "./SubventionsPaymentsStatistique.controller";

    export let elements;
    export let year;

    const controller = new SubventionsPaymentsStatistiqueController(elements);

    const { paymentsAmount } = controller;

    $: elements, controller.updateElements(elements);
</script>

<div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-9">
        <h3 class="fr-h4">Demandes de subventions collectées</h3>
        <p class="fr-mb-0 fr-text--sm">
            D'après les données récupérées via Dauphin, Osiris, Fonjep et la Caisse des Dépôts.
        </p>
        <p class="asterisk fr-text--sm">
            Certaines informations et données peuvent être manquantes car elles n’ont pas encore été rattachées au
            service.
        </p>
    </div>
    <div class="fr-col-3">
        <h3 class="fr-h4">Versements réalisés</h3>
        <p class="fr-text--sm">
            Total des paiements en <b>{year}</b>
            :
            <b>{$paymentsAmount}</b>
            <br />
            D'après les données récupérées via Chorus et Fonjep.
        </p>
    </div>
</div>

<style>
    .asterisk {
        font-weight: bold;
        font-style: italic;
    }
</style>

<script>
    import SubventionsPaymentsStatistiqueController from "./SubventionsPaymentsStatistique.controller";

    export let elements;
    export let year;

    const controller = new SubventionsPaymentsStatistiqueController(elements);

    const { paymentsAmount } = controller;

    $: elements, controller.updateElements(elements);
</script>

<div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-8">
        <h3 class="fr-h4">Demandes de subventions collectées</h3>
        <p class="fr-mb-0">D'après les données récupérées via Dauphin, Osiris, Fonjep et la Caisse des Dépôts.</p>
        <p class="asterisk">
            Certaines informations et données peuvent être manquantes car elles n’ont pas encore été rattachées au
            service.
        </p>
    </div>
    <div class="fr-col-4">
        <h3 class="fr-h4">Payments réalisés</h3>
        <p>
            Total des payments en <b>{year}</b>
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

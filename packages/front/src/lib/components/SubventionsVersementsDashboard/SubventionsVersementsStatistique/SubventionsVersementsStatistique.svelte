<script>
    import SubventionsVersementsStatistiqueController from "./SubventionsVersementsStatistique.controller";

    export let elements;
    export let year;

    const controller = new SubventionsVersementsStatistiqueController(elements);

    const { versementsAmount } = controller;

    $: elements, controller.updateElements(elements);
</script>

<div class="fr-grid-row fr-my-6w">
    <span class="fr-h4 fr-mb-2w">Total des versements réalisés en {year} : {$versementsAmount}</span>
    <p class="fr-mb-0">D'après les données récupérées via Dauphin, Osiris, Fonjep et la Caisse des Dépôts.</p>
    <p class="asterisk fr-mb-0">
        Certaines informations et données peuvent être manquantes car elles n’ont pas encore été rattachées au service.
    </p>
</div>

<style>
    .asterisk {
        font-weight: bold;
        font-style: italic;
    }
</style>

<script>
    import SubventionsVersemementsStatistiqueController from "./SubventionsVersemementsStatistique.controller";

    export let elements;
    export let year;

    const controller = new SubventionsVersemementsStatistiqueController(elements);

    const { subventionsPercent, versementsAmount } = controller;

    $: elements, controller.updateElements(elements);
</script>

<div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-8">
        <h3>Demandes de subventions collectées</h3>
        <p>
            <b>{$subventionsPercent}%</b>
            des demandes ont été accordées en
            <b>{year}.</b>
            <br />
            D'après les données récupérées via Dauphin, Osiris, Fonjep et la Caisse des Dépôts.
        </p>
    </div>
    <div class="fr-col-4">
        <h3>Versements réalisés</h3>
        <p>
            Total des versements en <b>{year}</b>
            :
            <b>{$versementsAmount}</b>
            <br />
            D'après les données récupérées via Chorus et Fonjep.
        </p>
    </div>
</div>

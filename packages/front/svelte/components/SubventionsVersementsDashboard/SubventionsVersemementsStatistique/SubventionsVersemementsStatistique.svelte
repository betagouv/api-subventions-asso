<script>
    import SubventionsVersemementsStatistiqueController from "./SubventionsVersemementsStatistique.controller";

    export let elements;
    export let year;

    const controller = new SubventionsVersemementsStatistiqueController(elements);

    const { subventionsPercent, versementsAmount } = controller;

    $: elements, controller.updateElements(elements);
</script>

<div class="totals">
    <div class="subventions">
        <h3>Demandes de subventions collectées</h3>
        <p>
            <b>{$subventionsPercent}%</b>
            des demandes ont été accordées en
            <b>{year}.</b>
            <br />
            D'après les données récupérées via Dauphin, Osiris et Fonjep.
        </p>
    </div>
    <div class="versements">
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

<style>
    .totals {
        display: flex;
    }

    .totals > .subventions {
        flex-grow: 3;
    }

    .totals > .versements {
        flex-grow: 1;
    }

    .totals div:last-child {
        width: 360px;
        max-width: 360px;
    }
</style>

<script>
    import { onMount } from "svelte";
    import Button from "../../../dsfr/Button.svelte";
    import Select from "../../../dsfr/Select.svelte";
    import associationService from "../association.service";
    import { mapSubventionsAndVersements } from "../association.helper";
    import { numberToEuro } from "../../../helpers/dataHelper";
    import SubventionTable from "./SubventionTable.svelte";
    import VersementTable from "./VersementTable.svelte";

    export let association;

    const etablissementFilterArray = ["Pour l'ensemble des établissements (siège + établissements)"];
    const FIRST_EXERCICE_YEAR = 2017;
    const CURRENT_YEAR = new Date().getFullYear();

    let exercices = [];
    for (let i = FIRST_EXERCICE_YEAR; i <= CURRENT_YEAR; i++) {
        exercices.push({ value: i, label: `Exercice ${i} (année civile)` });
    }

    let selectedExerciceIndex = exercices.length - 1;
    $: currentExercice = exercices[selectedExerciceIndex];
    let selectedEtablissement = 0;

    let promise = new Promise(resolve => null);
    onMount(async () => {
        const subventions = await associationService.getSubventions(association.siren);
        const versements = await associationService.getVersements(association.siren);
        mapSubventionsAndVersements({ subventions, versements });
    });

    function filterEtablissements(event) {
        selectedEtablissement = event.detail;
        console.log("filterEtablissements", event.detail);
    }

    function filterExercice(event) {
        selectedExerciceIndex = event.detail;
        console.log("filterExercice", event.detail);
    }

    function displayProviders() {
        console.log("displayProviders");
    }
</script>

<div class="title">
    <h2>Tableau de bord des subventions</h2>
    <div>
        <Button on:click={displayProviders} type="secondary">Voir la liste des fournisseurs de donnée</Button>
    </div>
</div>
<div class="filters">
    <div class="select-wrapper">
        <Select on:change={filterEtablissements} selected={selectedEtablissement} options={etablissementFilterArray} />
    </div>
    <div class="select-wrapper">
        <Select on:change={filterExercice} selected={exercices[selectedExerciceIndex].value} options={exercices} />
    </div>
</div>
<div class="totals">
    <div class="subventions">
        <h3>Demande de subventions</h3>
        <p>
            Montant total accordé : <b>{numberToEuro(115900)}</b>
            (sur {numberToEuro(168000)} demandé, soit {76}%)
            <br />
            d'après les données collectées à ce jour
        </p>
    </div>
    <div class="versements">
        <h3>Versements réalisés</h3>
        <p>
            Pour l'exercice {currentExercice.value} :
            <b>{numberToEuro(816786)}</b>
        </p>
    </div>
</div>
{#await promise then result}
    <div>
        <SubventionTable subventions={result[0]} />
        <VersementTable versements={result[1]} />
    </div>
{/await}

<style>
    .title {
        display: flex;
        justify-content: space-between;
        padding-bottom: 15px;
    }

    .title > div {
        align-self: baseline;
    }

    .filters {
        display: flex;
        padding-bottom: 96px;
        gap: 24px;
    }

    .select-wrapper {
        flex: 1 1 0px;
    }

    .totals {
        display: flex;
    }

    .totals > .subventions {
        flex-grow: 3;
    }

    .totals > .versements {
        flex-grow: 1;
    }
</style>

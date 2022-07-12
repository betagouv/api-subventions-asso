<script>
    import { onMount } from "svelte";
    import Button from "../../../dsfr/Button.svelte";
    import Select from "../../../dsfr/Select.svelte";
    import Spinner from "../../../components/Spinner.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte";
    import associationService from "../association.service";
    import { mapSubventionsAndVersements } from "../association.helper";
    import { numberToEuro } from "../../../helpers/dataHelper";
    import SubventionTable from "./SubventionTable.svelte";
    import VersementTable from "./VersementTable.svelte";
    import DataNotFound from "../../../components/DataNotFound.svelte";

    export let association;

    const defaultEtablissementFilter = {
        value: "*",
        label: "Pour l'ensemble des établissements (siège + établissements)"
    };
    let years = [];
    let etablissementFilterArray = [];
    let exercices = [];
    let selectedExerciceIndex = 0;
    let selectedEtablissement = 0;
    let elements = [];

    let scopedElements = [];
    let scopedVersementsAmount = 0;
    let scopedSubventionAmount = 0;
    let scopedSubventionRequestedAmount = 0;
    let scopedPerscentSubvention = 0;

    let promise = new Promise(() => null);
    onMount(async () => {
        const siretSiege = association.siren + association.nic_siege;
        const subventionsPromise = associationService.getSubventions(association.siren);
        const versementsPromise = associationService.getVersements(association.siren);
        promise = Promise.all([subventionsPromise, versementsPromise]).then(([subventions, versements]) => {
            elements = mapSubventionsAndVersements({ subventions, versements });
            const sirets = [...new Set(elements.map(element => element.siret))];
            years = [...new Set(elements.map(element => element.year))].sort((a, b) => a - b);

            exercices = years.map((year, i) => ({ value: i, label: `Exercice ${year} (année civile)` }));
            selectedExerciceIndex = years.length - 1;
            etablissementFilterArray = [
                defaultEtablissementFilter,
                ...sirets.map(siret => ({
                    value: siret,
                    label: siret === siretSiege ? `Pour le siège (${siret})` : `Pour l'établissement (${siret})`
                })).sort((etablisement) => etablisement.value === siretSiege ? -1 : 0)
            ];

            applyScope();
        });
    });

    function filterEtablissements(event) {
        selectedEtablissement = event.detail;
        applyScope();
    }

    function filterExercice(event) {
        selectedExerciceIndex = event.detail;
        applyScope();
    }

    function applyScope() {
        const currentSiret = etablissementFilterArray[selectedEtablissement].value;
        const currentYear = years[exercices[selectedExerciceIndex].value];

        scopedElements = elements.filter(element => {
            const goodSiret = currentSiret == "*" ? true : element.siret === currentSiret;
            const goodYear = element.year == currentYear;

            return goodSiret && goodYear;
        });

        scopedVersementsAmount = scopedElements.reduce((acc, element) => {
            if (!element.versements) return acc;
            return acc + element.versements.reduce((total, versement) => total + versement.amount, 0);
        }, 0);

        scopedSubventionAmount = scopedElements.reduce((acc, element) => {
            if (!element.subvention || !element.subvention.montants) return acc;
            return acc + (element.subvention.montants.accorde | 0);
        }, 0);

        scopedSubventionRequestedAmount = scopedElements.reduce((acc, element) => {
            if (!element.subvention || !element.subvention.montants) return acc;
            return acc + (element.subvention.montants.demande | 0);
        }, 0);
        scopedPerscentSubvention = ((scopedSubventionAmount / scopedSubventionRequestedAmount) * 100 || 100).toFixed(0);
    }

    function displayProviders() {
        console.log("displayProviders");
    }
</script>

{#await promise}
    <Spinner description="Chargement des demandes de subventions en cours ..." />
{:then _null}
    <div class="title">
        <h2>Tableau de bord des subventions</h2>
        <div>
            <Button
                on:click={displayProviders}
                type="secondary"
                disabled={true}
                tooltip="Fonctionnalités en cours de développement">
                Voir la liste des fournisseurs de donnée
            </Button>
        </div>
    </div>
    <div class="filters">
        <div class="select-wrapper">
            <Select
                on:change={filterEtablissements}
                selected={etablissementFilterArray[selectedEtablissement].value}
                options={etablissementFilterArray} />
        </div>
        <div class="select-wrapper">
            <Select on:change={filterExercice} selected={exercices[selectedExerciceIndex].value} options={exercices} />
        </div>
    </div>
    <div class="totals">
        <div class="subventions">
            <h3>Demande de subventions</h3>
            <p>
                Montant total accordé : <b>{numberToEuro(scopedSubventionAmount)}</b>
                (sur {numberToEuro(scopedSubventionRequestedAmount)} demandé, soit {scopedPerscentSubvention}%)
                <br />
                d'après les données collectées à ce jour
            </p>
        </div>
        <div class="versements">
            <h3>Versements réalisés</h3>
            <p>
                Pour l'exercice {years[exercices[selectedExerciceIndex].value]} :
                <b>{numberToEuro(scopedVersementsAmount)}</b>
            </p>
        </div>
    </div>
    <div class="tables">
        <div>
            <SubventionTable elements={scopedElements} />
        </div>
        <div>
            <VersementTable elements={scopedElements} />
        </div>
    </div>
{:catch error}
    {#if error.request && error.request.status == 404}
        <DataNotFound />
    {:else}
        <ErrorAlert message={error.message} />
    {/if}
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

    .tables {
        display: flex;
        justify-content: space-between;
    }

    .tables div:first-child {
        width: 760px;
        max-width: 760px;
    }
    .tables div:last-child {
        width: 360px;
        max-width: 360px;
    }
</style>

<script>
    import { onMount } from "svelte";
    import Button from "../../../../dsfr/Button.svelte";
    import Select from "../../../../dsfr/Select.svelte";
    import { numberToEuro } from "../../../../helpers/dataHelper";
    import Spinner from "../../../../components/Spinner.svelte";
    import ErrorAlert from "../../../../components/ErrorAlert.svelte";
    import DataNotFound from "../../../../components/DataNotFound.svelte";

    import SubventionTable from "../SubventionTable.svelte";
    import VersementTable from "../VersementTable.svelte";

    import DashboardCore from "./Dashboard.core";
    import ProviderModal from "../ProviderModal.svelte";

    export let association;

    let data = {};
    let promise = new Promise(() => null);
    const dashboardCore = new DashboardCore(association);

    onMount(() => (promise = dashboardCore.mount()));
    dashboardCore.onRender(_data => (data = _data));
</script>

{#await promise}
    <Spinner description="Chargement des demandes de subventions en cours ..." />
{:then _null}
    <div class="title">
        <h2>Tableau de bord des subventions</h2>
        <div>
            <Button type="secondary" ariaControls="fr-modal-providers">
                Voir la liste des fournisseurs de données
            </Button>
        </div>
    </div>
    <div class="filters">
        <div class="select-wrapper">
            <Select
                on:change={event => dashboardCore.filterByEtablissement(event.detail)}
                selected={data.selectedEtablissement.value}
                options={data.etablissements} />
        </div>
        <div class="select-wrapper">
            <Select
                on:change={event => dashboardCore.filterByExercice(event.detail)}
                selected={data.selectedExercice.value}
                options={data.exercices} />
        </div>
    </div>
    <div class="totals">
        <div class="subventions">
            <h3>Demande de subventions</h3>
            <p>
                Montant total accordé : <b>{numberToEuro(data.subventionAmount)}</b>
                (sur {numberToEuro(data.subventionRequesteAmount)} demandé, soit {data.percentSubvention}%)
                <br />
                d'après les données collectées à ce jour
            </p>
        </div>
        <div class="versements">
            <h3>Versements réalisés</h3>
            <p>
                Pour l'exercice {data.selectedYear} :
                <b>{numberToEuro(data.versementsAmount)}</b>
            </p>
        </div>
    </div>
    <div class="tables">
        <div>
            <SubventionTable
                elements={data.elements}
                sort={col => dashboardCore.sortByColumn(col)}
                currentSort={data.currentSort}
                sortDirection={data.sortDirection} />
        </div>
        <div>
            <VersementTable
                elements={data.elements}
                sort={col => dashboardCore.sortByColumn(col)}
                currentSort={data.currentSort}
                sortDirection={data.sortDirection} />
        </div>
    </div>
    <ProviderModal id="providers" />
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

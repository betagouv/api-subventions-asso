<script>
    import { onDestroy, onMount } from "svelte";
    import Button from "../../../../dsfr/Button.svelte";
    import Select from "../../../../dsfr/Select.svelte";
    import { numberToEuro, valueOrHyphen } from "../../../../helpers/dataHelper";
    import Spinner from "../../../../components/Spinner.svelte";
    import ErrorAlert from "../../../../components/ErrorAlert.svelte";
    import DataNotFound from "../../../../components/DataNotFound.svelte";

    import SubventionTable from "../SubventionTable.svelte";
    import VersementTable from "../VersementTable.svelte";

    import DashboardCore from "./Dashboard.core";
    import ProviderModal from "../ProviderModal.svelte";
    import ProgressBar from "../../../../components/ProgressBar.svelte";
    import Alert from "../../../../dsfr/Alert.svelte";

    export let association;

    let data = {};
    let promise = new Promise(() => null);
    const dashboardCore = new DashboardCore(association);

    onMount(() => (promise = dashboardCore.mount()));
    dashboardCore.onRender(_data => (data = _data));
    onDestroy(() => dashboardCore.destroy());
</script>

{#await promise}
    <Spinner description="Chargement des demandes de subventions en cours ..." />
{:then _null}
    {#if data.etablissements?.length}
        <div class="title">
            <h2>Tableau de bord</h2>
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
        {#if data.elements?.length}
        <div class="totals">
            <div class="subventions">
                <h3>Demandes de subventions collectées</h3>
                <p>
                    <b>{data.percentSubvention}%</b>
                    des demandes ont été accordées en
                    <b>{data.selectedYear}.</b>
                    <br />
                    D'après les données récupérées via Osiris, Dauphin et Fonjep.
                </p>
                </div>
                <div class="versements">
                    <h3>Versements réalisés</h3>
                    <p>
                        Total des versements en <b>{data.selectedYear}</b>
                        :
                        <b>{valueOrHyphen(numberToEuro(data.versementsAmount))}</b>
                        <br />
                        D'après les données récupérées via Chorus.
                    </p>
                </div>
            </div>
            {#if data.status != "end"}
                <Alert type="info" title="Récupérations en cours des subventions chez nos fourniseurs ...">
                    <ProgressBar
                        percent={(data.subventionLoading.providerAnswers / data.subventionLoading.providerCalls) * 100} />
                </Alert>
            {/if}
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
        {:else}
            <DataNotFound content="Nous sommes désolés, nous n'avons trouvée aucune données pour cette établissement sur l'année {data.selectedYear}"/>
        {/if}
        <ProviderModal id="providers" />
    {:else}
        <DataNotFound />
    {/if}
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
    .tables div:last-child,
    .totals div:last-child {
        width: 360px;
        max-width: 360px;
    }
</style>

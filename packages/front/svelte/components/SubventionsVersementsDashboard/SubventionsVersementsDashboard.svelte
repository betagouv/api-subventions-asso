<script>
    import Spinner from "../Spinner.svelte";
    import Button from "../../dsfr/Button.svelte";
    import { modal } from "../../store/modal.store";
    import Select from "../../dsfr/Select.svelte";
    import Alert from "../../dsfr/Alert.svelte";
    import ProgressBar from "../ProgressBar.svelte";
    import DataNotFound from "../DataNotFound.svelte";
    import ErrorAlert from "../ErrorAlert.svelte";

    import SubventionsVersementsDashboardController from "./SubventionsVersementsDashboard.controller";
    import SubventionsVersemementsStatistique from "./SubventionsVersemementsStatistique/SubventionsVersemementsStatistique.svelte";
    import SubventionTable from "./SubventionTable/SubventionTable.svelte";
    import VersementTable from "./VersementTable/VersementTable.svelte";
    import ProviderModal from "./Modals/ProviderModal/ProviderModal.svelte";

    export let identifier;

    const controller = new SubventionsVersementsDashboardController(identifier);

    const promise = controller.load();

    const { loaderStateStore, elements, exercicesOptions, selectedExercice, selectedYear, sortDirection, sortColumn } =
        controller;

    const displayModal = () => modal.update(() => ProviderModal);
</script>

{#await promise}
    <Spinner description="Chargement des demandes de subventions en cours ..." />
{:then _null}
    <div class="title">
        <h2>Tableau de bord</h2>
        <div>
            <Button type="secondary" ariaControls="fr-modal" on:click={displayModal}>
                Voir la liste des fournisseurs de données
            </Button>
        </div>
    </div>
    <div class="filters">
        <div class="select-wrapper">
            <Select
                on:change={event => controller.updateSelectedExercice(event.detail)}
                selected={$selectedExercice}
                options={$exercicesOptions} />
        </div>
    </div>
    {#if $elements?.length}
        <SubventionsVersemementsStatistique elements={$elements} year={$selectedYear} />

        {#if $loaderStateStore.status != "end"}
            <Alert type="info" title="Récupérations en cours des subventions chez nos fourniseurs ...">
                <ProgressBar percent={$loaderStateStore.percent} />
            </Alert>
        {/if}
        <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-8">
                <SubventionTable
                    elements={$elements}
                    sort={column => controller.sort(column)}
                    currentSort={$sortColumn}
                    sortDirection={$sortDirection} />
            </div>
            <div class="fr-col-4">
                <VersementTable
                    elements={$elements}
                    sort={column => controller.sort(column)}
                    currentSort={$sortColumn}
                    sortDirection={$sortDirection} />
            </div>
        </div>
    {:else}
        <DataNotFound
            content="Nous sommes désolés, nous n'avons trouvé aucune donnée pour cette établissement sur l'année {$selectedYear}" />
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
</style>

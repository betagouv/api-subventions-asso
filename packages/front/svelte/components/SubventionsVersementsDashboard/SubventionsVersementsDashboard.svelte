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
    import SubventionsVersementsStatistique from "./SubventionsVersementsStatistique/SubventionsVersementsStatistique.svelte";
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
    <div class="fr-grid-row fr-mt-3w fr-py-2w flex space-between">
        <h2>Tableau de bord</h2>
        <div class="baseline">
            <Button
                on:click={() => controller.download()}
                disabled={$loaderStateStore.status != "end"}
                icon="download-line"
                iconPosition="right">
                Télécharger les données - (BÊTA)
            </Button>
        </div>
    </div>
    <div class="fr-grid-row fr-py-4w flex space-between">
        <div class="fr-col-3">
            {#if $exercicesOptions.length}
                <Select
                    on:change={event => controller.updateSelectedExercice(event.detail)}
                    selected={$selectedExercice}
                    options={$exercicesOptions} />
            {/if}
        </div>
        <Button type="tertiary" outline={false} ariaControls="fr-modal" on:click={displayModal}>
            Voir la liste des fournisseurs de données
        </Button>
    </div>
    <div class="fr-py-3w compact-columns">
        {#if $elements?.length}
            <SubventionsVersementsStatistique elements={$elements} year={$selectedYear} />
            {#if $loaderStateStore.status != "end"}
                <Alert type="info" title="Récupération en cours des subventions chez nos fournisseurs ...">
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
    </div>
{:catch error}
    {#if error.request && error.request.status == 404}
        <DataNotFound />
    {:else}
        <ErrorAlert message={error.message} />
    {/if}
{/await}

<style>
    .baseline {
        align-self: baseline;
    }

    .compact-columns :global(.fr-grid-row--gutters) {
        margin: -0.5rem;
    }

    .compact-columns :global(.fr-grid-row--gutters > [class^="fr-col-"]) {
        padding: 0.5rem;
    }
</style>

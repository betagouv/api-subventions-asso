<script>
    import Spinner from "../Spinner.svelte";
    import ProgressBar from "../ProgressBar.svelte";
    import DataNotFound from "../DataNotFound.svelte";
    import ErrorAlert from "../ErrorAlert.svelte";

    import SubventionsPaymentsDashboardController from "./SubventionsPaymentsDashboard.controller";
    import SubventionsPaymentsStatistique from "./SubventionsPaymentsStatistique/SubventionsPaymentsStatistique.svelte";
    import SubventionTable from "./SubventionTable/SubventionTable.svelte";
    import PaymentTable from "./PaymentTable/PaymentTable.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Select from "$lib/dsfr/Select.svelte";
    import Button from "$lib/dsfr/Button.svelte";

    export let identifier;

    const controller = new SubventionsPaymentsDashboardController(identifier);

    const promise = controller.load();

    const { loaderStateStore, elements, exercicesOptions, selectedExercice, selectedYear, sortDirection, sortColumn } =
        controller;
</script>

{#await promise}
    <Spinner description="Chargement des demandes de subventions en cours ..." />
{:then _null}
    <div class="fr-grid-row fr-pt-4w fr-pb-2w flex space-between">
        <h2>Subventions</h2>
        <div class="baseline">
            {#if $elements && $elements.length}
                <Button
                    on:click={() => controller.download()}
                    disabled={$loaderStateStore.status != "end"}
                    icon="download-line"
                    trackingDisable={true}
                    iconPosition="right">
                    Télécharger les données
                </Button>
            {/if}
        </div>
    </div>
    <div class="fr-grid-row flex space-between">
        <div class="fr-col-3">
            {#if $exercicesOptions.length}
                <Select
                    on:change={event => controller.updateSelectedExercice(event.detail)}
                    selected={$selectedExercice}
                    options={$exercicesOptions} />
            {/if}
        </div>
        <div class="align-bottom">
            <a
                on:click={controller.clickProviderLink}
                class="fr-link"
                href={controller.providerBlogUrl}
                target="_blank"
                rel="noopener external">
                Quelles données retrouver dans Data.Subvention ?
            </a>
        </div>
    </div>
    <div class="fr-mt-6w compact-columns">
        {#if $elements?.length}
            <div>
                <SubventionsPaymentsStatistique elements={$elements} year={$selectedYear} />
            </div>
            {#if $loaderStateStore.status != "end"}
                <Alert type="info" title="Récupération en cours des subventions chez nos fournisseurs ...">
                    <ProgressBar percent={$loaderStateStore.percent} />
                </Alert>
            {/if}
            <div class="fr-grid-row fr-mt-n4w">
                <div class="fr-col-9">
                    <SubventionTable
                        elements={$elements}
                        sort={column => controller.sort(column)}
                        currentSort={$sortColumn}
                        sortDirection={$sortDirection} />
                </div>
                <div class="fr-col-3">
                    <PaymentTable
                        elements={$elements}
                        sort={column => controller.sort(column)}
                        currentSort={$sortColumn}
                        sortDirection={$sortDirection} />
                </div>
            </div>
        {:else}
            <DataNotFound content={controller.notFoundMessage} />
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
    .align-bottom {
        margin-top: auto;
    }

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

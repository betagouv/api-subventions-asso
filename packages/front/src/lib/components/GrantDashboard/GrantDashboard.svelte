<script lang="ts">
    import DataNotFound from "../DataNotFound.svelte";
    import ErrorAlert from "../ErrorAlert.svelte";
    import { GrantDashboardController } from "./GrantDashboard.controller";
    import ApplicationRow from "./ApplicationRow/ApplicationRow.svelte";
    import PaymentRow from "./PaymentRow/PaymentRow.svelte";
    import GrantsStatistique from "$lib/components/GrantDashboard/GrantsStatistique/GrantsStatistique.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Select from "$lib/dsfr/Select.svelte";
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";

    export let structureId;

    const tableId = "grant-dashboard";

    const ctrl = new GrantDashboardController(structureId);
    const {
        grantPromise,
        grants,
        headers,
        rows,
        selectedExerciseIndex,
        selectedExercise,
        exerciseOptions,
        isExtractLoading,
        selectedGrants,
    } = ctrl;
</script>

{#await grantPromise}
    <Spinner description="Chargement des demandes de subventions en cours ..." />
{:then _null}
    <div class="fr-grid-row fr-pt-4w fr-pb-2w flex space-between">
        <h2>Subventions</h2>
        <div class="baseline">
            {#if $grants && $grants.length}
                {#if $isExtractLoading}
                    <Button icon="refresh-line" trackingDisable={true} iconPosition="right" disabled={true}>
                        Chargement
                    </Button>
                {:else}
                    <Button
                        on:click={() => ctrl.download()}
                        icon="download-line"
                        trackingDisable={true}
                        iconPosition="right">
                        Télécharger les données
                    </Button>
                {/if}
            {/if}
        </div>
    </div>
    <div class="fr-grid-row flex space-between">
        <div class="fr-col-3">
            {#if $exerciseOptions?.length}
                <Select
                    on:change={event => ctrl.selectExercise(event.detail)}
                    selected={$selectedExerciseIndex}
                    options={$exerciseOptions} />
            {/if}
        </div>
        <div class="align-bottom">
            <a
                on:click={ctrl.clickProviderLink}
                class="fr-link"
                href={ctrl.providerBlogUrl}
                target="_blank"
                rel="noopener external">
                Quelles données retrouver dans Data.Subvention ?
            </a>
        </div>
    </div>
    <div class="fr-mt-6w compact-columns">
        {#if $selectedGrants?.length}
            <div>
                <GrantsStatistique grants={$grants} year={$selectedExercise} />
            </div>
            <div class="negative-margin">
                <Table
                    id={tableId}
                    on:sort={event => ctrl.sortTable(event.detail)}
                    title="Tableau de subventions et leurs versements"
                    hideTitle={true}
                    size="md"
                    sortable={true}
                    scrollable={false}
                    bordered={false}
                    {headers}>
                    {#each $rows as row, rowIndex}
                        <TableRow id={tableId} index={rowIndex} openModal={true}>
                            <ApplicationRow
                                on:click={() => ctrl.onApplicationClick(rowIndex)}
                                cells={row.applicationCells} />
                            <PaymentRow
                                on:click={() => ctrl.onPaymentClick(rowIndex)}
                                cells={row.paymentsCells}
                                granted={row.granted} />
                        </TableRow>
                    {/each}
                </Table>
            </div>
        {:else}
            <DataNotFound content={ctrl.notFoundMessage} />
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

    /* remove padding from fr-table__container and margin from fr-table */
    .negative-margin {
        margin-top: -2rem;
        margin-bottom: -2.5rem;
    }
</style>

<script lang="ts">
    import { GrantDashboardController } from "./GrantDashboard.controller";
    import Spinner from "$lib/components/Spinner.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Select from "$lib/dsfr/Select.svelte";

    export let structureId;

    const ctrl = new GrantDashboardController(structureId);
    const { grantPromise, grants, selectedGrants, selectedExerciseIndex, exerciseOptions, isExtractLoading } = ctrl;
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
{/await}

Hello new Grant DashBoard !! There is {$selectedGrants?.length} grant for the {$selectedExerciseIndex} exercise

<style>
    .baseline {
        align-self: baseline;
    }
</style>

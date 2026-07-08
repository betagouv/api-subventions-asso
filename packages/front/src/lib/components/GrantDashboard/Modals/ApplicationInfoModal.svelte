<script lang="ts">
    import { data } from "$lib/store/modal.store";
    import { numberToEuro } from "$lib/helpers/dataHelper.js";
    import type Store from "$lib/core/Store";
    import type { ApplicationFlatDto, OsirisActions } from "dto";
    import Spinner from "$lib/components/Spinner.svelte";
    import { ProviderName, type ProviderDetailsMap } from "$lib/resources/grant/grant.port";

    // @TODO: put this somewhere else ?
    type ApplicationModalData<T = ProviderDetailsMap[ProviderName]> = {
        application: ApplicationFlatDto;
        details: Promise<T>;
    };

    // used to type data
    const modalData = data as Store<ApplicationModalData>;

    let osirisDetails: Promise<OsirisActions> | null = null;

    $: {
        const appData = $data as ApplicationModalData;
        if (appData?.application.fournisseur === ProviderName.osiris) {
            osirisDetails = (appData as ApplicationModalData<OsirisActions>).details;
        } else {
            osirisDetails = null;
        }
    }
</script>

<section>
    <h4 class="fr-icon-arrow-right-line">Informations collectées</h4>
    <p class="fr-text--lead">
        {#if $modalData.application.montantAccorde}
            <span class="fr-text--bold">{numberToEuro($modalData.application.montantAccorde)}</span>
            ont été accordés {#if $modalData.application.montantDemande}
                sur <span class="fr-text--bold">{numberToEuro($modalData.application.montantDemande)}</span>
                demandés{/if}.
        {:else if $modalData.application.montantDemande}
            <span class="fr-text--bold">{numberToEuro($modalData.application.montantDemande)}</span>
            ont été demandés.
        {/if}
    </p>
    {#if $modalData.application.dateDepotDemande}
        <p class="fr-text--lg">
            <span class="fr-text--bold">Date de dépôt de la demande :</span>
            {$modalData.application.dateDepotDemande}
        </p>{/if}
    {#if $modalData.application.dateDecision}
        <p class="fr-text--lg">
            <span class="fr-text--bold">Date de décision du service instructeur :</span>
            {$modalData.application.dateDecision}
        </p>{/if}
</section>
{#if $modalData.application?.objet}
    <section>
        <p>{$modalData.application.objet}</p>
    </section>
{/if}

<!-- OSIRIS APPLICATION DETAILS -->
{#if osirisDetails}
    {#await osirisDetails}
        <Spinner></Spinner>
    {:then details}
        {#if details?.actions?.length}
            <section>
                <h4 class="fr-icon-arrow-right-line">Actions de la subvention</h4>
                {#each details.actions as action (action.intitule)}
                    <div>
                        <h5>{action.intitule}</h5>
                        <p>{action.description}</p>
                    </div>
                {/each}
            </section>
        {/if}
    {/await}
{/if}

<style>
    section h4 {
        color: var(--text-active-blue-france);
        margin-bottom: 1.33em;
    }

    section {
        margin-bottom: 3rem;
    }

    section:last-child {
        margin-bottom: 0;
    }

    section h4:is([class*=" fr-fi-"], h4[class*=" fr-icon-"], h4[class^="fr-fi-"], h4[class^="fr-icon-"])::before {
        margin-right: 0.5rem;
    }
</style>

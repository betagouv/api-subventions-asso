<script>
    import { data } from "$lib/store/modal.store";
    import { capitalizeFirstLetter } from "$lib/helpers/stringHelper";
    import { numberToEuro } from "$lib/helpers/dataHelper.js";
</script>

<!-- ApplicationFlatDto -->
{#if $data.application}
    <section>
        <h4 class="fr-icon-arrow-right-line">Informations collectées</h4>
        <p class="fr-text--lead">
            {#if $data.application.montantAccorde}
                <span class="fr-text--bold">{numberToEuro($data.application.montantAccorde)}</span>
                ont été accordés {#if $data.application.montantDemande}
                    sur <span class="fr-text--bold">{numberToEuro($data.application.montantDemande)}</span>
                    demandés{/if}.
            {:else if $data.application.montantDemande}
                <span class="fr-text--bold">{numberToEuro($data.application.montantDemande)}</span>
                ont été demandés.
            {/if}
        </p>
        {#if $data.application.date_depot}
            <p class="fr-text--lg">
                <span class="fr-text--bold">Date de dépôt de la demande :</span>
                {$data.application.date_depot}
            </p>{/if}
        {#if $data.application.date_decision}
            <p class="fr-text--lg">
                <span class="fr-text--bold">Date de décision du service instructeur :</span>
                {$data.application.date_decision}
            </p>{/if}
    </section>
    {#if $data.application?.objet}
        <section>
            <!-- <h4 class="fr-icon-arrow-right-line">{capitalizeFirstLetter(action.intitule)}</h4>
            {#each action.objectifs?.split("\n") || [] as line, index (index)}
                {#if line.length}
                    <p>{line}</p>
                {/if}
            {/each} -->
            <p>{$data.application.objet}</p>
        </section>
    {/if}
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

    /* uncomment when showing establishment
    .bigger-link {
        position: relative;
    }

    .bigger-link > a::before {
        position: absolute;
        width: 100%;
        height: 100%;
        content: "";
    }*/
</style>

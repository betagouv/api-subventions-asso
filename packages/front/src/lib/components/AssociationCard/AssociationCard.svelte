<script>
    import Card from "$lib/dsfr/Card.svelte";
    import { getFirstPartAddress, getLastPartAddress } from "$lib/resources/associations/association.helper";

    export let simplifiedAsso;

    const street = getFirstPartAddress(simplifiedAsso.address);
    const city = getLastPartAddress(simplifiedAsso.address);

    const getNbEtabLabel = () =>
        (simplifiedAsso.nbEtabs == 1) | 0
            ? `${simplifiedAsso.nbEtabs} établissement rattaché`
            : `${simplifiedAsso.nbEtabs} établissements rattachés`;
</script>

<Card>
    <svelte:fragment slot="card-start">
        <p class="card-start fr-card__detail fr-text--sm fr-icon-community-line">Association</p>
    </svelte:fragment>
    <svelte:fragment slot="card-title">
        <h3 class="fr-card__title fr-h6">
            <a href="/association/{simplifiedAsso.siren}" class="fr-card__link overflow-ellipsis-3">
                {simplifiedAsso.name}
            </a>
        </h3>
    </svelte:fragment>
    <div class="flex">
        <p>
            <b>RNA</b>
            : {simplifiedAsso.rna}
        </p>
        <span class="circle-separator fr-px-2v">●</span>
        <p>
            <b>SIREN</b>
            : {simplifiedAsso.siren}
        </p>
    </div>
    <div class="address">
        <!-- if history was created before we saved the address, do not display -->
        {#if simplifiedAsso.address}
            <div>
                <span class="icon-address fr-mr-1w fr-icon-map-pin-2-line" />
            </div>
            <div class="ellipsis">
                <span class="fr-text--bold ellipsis">{street}</span>
                <br />
                <span class="fr-text--bold">{city}</span>
            </div>
        {/if}
    </div>
    <p />
    <div slot="card-end">
        <!-- if history was created before we saved the nb of estabs, do not display -->
        {#if simplifiedAsso.nbEtabs}
            <p class="info fr-card__detail fr-icon-info-fill fr-text--sm">
                {getNbEtabLabel()}
            </p>
        {/if}
    </div>
</Card>

<style>
    .circle-separator {
        text-align: center;
        font-size: 0.6em;
    }

    .address div:first-child {
        flex: 0 0 2em;
    }

    .icon-address,
    .card-start {
        color: var(--text-active-blue-france);
    }

    .card-start.fr-card__detail:before {
        color: var(--text-active-blue-france);
        --icon-size: 1.5em;
    }

    .info.fr-card__detail:before {
        --icon-size: 1.5em;
    }

    .info.fr-card__detail {
        color: var(--text-default-info);
    }

    .address {
        display: flex;
    }
</style>

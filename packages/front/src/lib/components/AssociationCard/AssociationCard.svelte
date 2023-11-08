<script>
    import Card from "$lib/dsfr/Card.svelte";
    import { getFirstPartAddress, getLastPartAddress } from "$lib/resources/associations/association.helper";

    export let title;
    export let simplifiedAsso;

    const street = getFirstPartAddress(simplifiedAsso.address);
    const city = getLastPartAddress(simplifiedAsso.address);
</script>

<Card {title} titleEllipsis="3" titleLevel="6" url="/association/{simplifiedAsso.siren}">
    <svelte:fragment slot="card-start">
        <p class="card-start fr-card__detail fr-text--sm fr-icon-community-line">Association</p>
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
        {#if simplifiedAsso.address}
            <div>
                <span class="icon-address fr-mr-1w fr-icon-map-pin-2-line" />
            </div>
            <div>
                <!-- if history was created before we saved the address, do not display -->
                <span class="fr-text--bold">{street}</span>
                <br />
                <span class="fr-text--bold">{city}</span>
            </div>
        {/if}
    </div>
    <p />
    <div slot="card-end">
        {#if simplifiedAsso.nbEtabs}
            <p class="info fr-card__detail fr-icon-info-fill fr-text--sm">
                <!-- <span class="fr-icon-info-fill" /> -->
                {`${simplifiedAsso.nbEtabs} établissements rattachés`}
            </p>
        {/if}
    </div>
</Card>

<style>
    .circle-separator {
        text-align: center;
        font-size: 0.6em;
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

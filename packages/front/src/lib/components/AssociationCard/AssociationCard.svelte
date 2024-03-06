<script lang="ts">
    import AssociationCardController from "./AssociationCard.controller";
    import Card from "$lib/dsfr/Card.svelte";
    import { valueOrNotFound } from "$lib/helpers/dataHelper";

    export let simplifiedAsso;
    // only used for search page
    // TODO: make AssociationCard component a dumb component and pass the redirection action to parent component ?
    export let searchKey: string | undefined = undefined;

    const ctrl = new AssociationCardController(simplifiedAsso, searchKey);
</script>

<Card title={simplifiedAsso.name} url={ctrl.url} titleStyle="h6">
    <svelte:fragment slot="card-start">
        <p class="card-start fr-card__detail fr-text--sm fr-icon-community-line">Association</p>
    </svelte:fragment>
    <div class="flex">
        <p>
            <b>RNA</b>
            : {valueOrNotFound(simplifiedAsso.rna)}
        </p>
        <span class="circle-separator text-center fr-px-2v">●</span>
        <p>
            <b>SIREN</b>
            : {valueOrNotFound(simplifiedAsso.siren)}
        </p>
    </div>
    <div class="address">
        <!-- if history was created before we saved the address, do not display -->
        {#if simplifiedAsso.address}
            <div>
                <span class="icon-address fr-mr-1w fr-icon-map-pin-2-line" />
            </div>
            <div class="ellipsis">
                <span class="fr-text--bold ellipsis">{ctrl.street}</span>
                <br />
                <span class="fr-text--bold">{ctrl.city}</span>
            </div>
        {/if}
    </div>
    <p />
    <div slot="card-end">
        <!-- if history was created before we saved the nb of estabs, do not display -->
        {#if simplifiedAsso.nbEtabs}
            <p class="info fr-card__detail fr-icon-info-fill fr-text--sm">
                {ctrl.nbEtabsLabel}
            </p>
        {/if}
    </div>
</Card>

<style>
    .circle-separator {
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

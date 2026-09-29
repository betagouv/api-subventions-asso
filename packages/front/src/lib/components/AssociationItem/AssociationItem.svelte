<script lang="ts">
    import AssociationItemController from "./AssociationItem.controller";
    import { valueOrNotFound } from "$lib/helpers/dataHelper";
    import type { RechercheAssociationDto } from "dto";

    export let simplifiedAsso: RechercheAssociationDto;
    export let searchKey: string | undefined = undefined;

    const ctrl = new AssociationItemController(simplifiedAsso, searchKey);
</script>

<div class="fr-col-12">
    <article class="association-item">
        <h3 class="association-item-title fr-mb-0">
            <a href={ctrl.url} class="association-item-link">
                {simplifiedAsso.name}
            </a>
        </h3>
        <p class="association-item-identifiers fr-mb-0">
            <b>RNA : {valueOrNotFound(simplifiedAsso.rna)}</b>
            <span class="circle-separator" aria-hidden="true"></span>
            <b>SIREN : {valueOrNotFound(simplifiedAsso.siren)}</b>
        </p>
        <div class="association-item-details">
            <!-- if history was created before we saved the address, do not display -->
            {#if simplifiedAsso.adresse}
                <p class="association-item-address fr-mb-0">
                    <span class="icon-address fr-mr-1w fr-icon-map-pin-2-line"></span>
                    <span class="association-item-address-text">
                        <span class="association-item-address-label">SIÈGE :</span>
                        <b>{ctrl.street} {ctrl.city}</b>
                    </span>
                </p>
            {/if}
            <!-- if history was created before we saved the nb of estabs, do not display -->
            {#if simplifiedAsso.nbEtabs !== undefined && simplifiedAsso.nbEtabs !== null}
                <p class="association-item-establishments fr-mb-0 fr-icon-info-fill">
                    {ctrl.nbEtabsLabel}
                </p>
            {/if}
        </div>
    </article>
</div>

<style>
    .circle-separator {
        display: inline-block;
        flex: 0 0 auto;
        width: 0.25rem;
        height: 0.25rem;
        margin: 0 0.5rem;
        border-radius: 50%;
        background-color: currentColor;
    }

    .association-item {
        box-sizing: border-box;
        height: 132px;
        padding: 20px 32px;
        border: 1px solid var(--border-default-grey);
        background-color: var(--background-default-grey);
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
    }

    .association-item-title {
        min-width: 0;
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.75rem;
        letter-spacing: 0;
        text-transform: uppercase;
    }

    .association-item-link {
        display: block;
        overflow: hidden;
        color: var(--text-title-grey);
        background-image: none;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .association-item-identifiers {
        display: flex;
        align-items: center;
        color: var(--text-default-grey);
        font-size: 1rem;
        line-height: 1.5rem;
        letter-spacing: 0;
        white-space: nowrap;
    }

    .association-item-details {
        display: flex;
        align-items: center;
        gap: 20px;
        min-width: 0;
    }

    .association-item-address {
        display: flex;
        align-items: center;
        min-width: 0;
        color: var(--text-default-grey);
        font-size: 0.875rem;
        line-height: 1.5rem;
        letter-spacing: 0;
        white-space: nowrap;
    }

    .association-item-address-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .association-item-address-label {
        color: #666666;
        font-weight: 700;
    }

    .association-item-establishments {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        color: var(--text-default-info);
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5rem;
        letter-spacing: 0;
        white-space: nowrap;
    }

    .association-item-establishments::before {
        --icon-size: 1rem;
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
    }

    .icon-address {
        color: var(--text-active-blue-france);
        flex: 0 0 auto;
    }
</style>

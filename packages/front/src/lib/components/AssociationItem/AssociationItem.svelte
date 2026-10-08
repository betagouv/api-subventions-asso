<script lang="ts">
    import AssociationItemController from "./AssociationItem.controller";
    import { valueOrNotFound } from "$lib/helpers/dataHelper";
    import type { RechercheAssociationDto } from "dto";

    export let simplifiedAsso: RechercheAssociationDto;
    export let searchKey: string | undefined = undefined;

    const ctrl = new AssociationItemController(simplifiedAsso, searchKey);
</script>

<div class="fr-col-12">
    <article class="association fr-px-4w fr-py-5v">
        <h3 class="fr-h5 fr-mb-0">
            <a href={ctrl.url} class="fr-raw-link">
                {simplifiedAsso.name}
            </a>
        </h3>
        <p class="identifiers fr-text--md fr-mb-0">
            <b>RNA : {valueOrNotFound(simplifiedAsso.rna)}</b>
            <span class="circle-separator" aria-hidden="true"></span>
            <b>SIREN : {valueOrNotFound(simplifiedAsso.siren)}</b>
        </p>
        <div class="details">
            {#if simplifiedAsso.adresse}
                <p class="address fr-text--sm fr-mb-0">
                    <span class="icon-address fr-mr-1w fr-icon-map-pin-2-line"></span>
                    <span class="text">
                        <span class="label">SIÈGE :</span>
                        <b>{ctrl.street} {ctrl.city}</b>
                    </span>
                </p>
            {/if}
            {#if simplifiedAsso.nbEtabs !== undefined && simplifiedAsso.nbEtabs !== null}
                <p class="establishments fr-text--sm fr-mb-0 fr-icon-info-fill fr-icon--sm">
                    {ctrl.nbEtabsLabel}
                </p>
            {/if}
        </div>
    </article>
</div>

<style>
    .association {
        border: 1px solid var(--border-default-grey);
        background-color: var(--background-default-grey);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .association > .identifiers {
        display: flex;
        align-items: center;
        white-space: nowrap;
    }

    .association > .identifiers > .circle-separator {
        width: 0.25rem;
        height: 0.25rem;
        margin: 0 0.5rem;
        border-radius: 50%;
        background-color: currentColor;
    }

    .association > .details {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        min-width: 0;
    }

    .association > .details > .address {
        display: flex;
        align-items: center;
        min-width: 0;
        white-space: nowrap;
    }

    .association > .details > .address > .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .association > .details > .address > .text > .label {
        color: var(--text-mention-grey);
        font-weight: 700;
    }

    .association > .details > .establishments {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        color: var(--text-default-info);
        white-space: nowrap;
    }

    .association > .details > .establishments::before {
        margin-right: 0.5rem;
    }

    .association > .details > .address > .icon-address {
        color: var(--text-active-blue-france);
    }
</style>

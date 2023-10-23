<script>
    import { ResultCardController } from "./ResultCard.controller";
    import Card from "$lib/dsfr/Card.svelte";

    export let association;
    export let searchValue;

    const ctrl = new ResultCardController(association, searchValue);
</script>

<Card size="12" url={ctrl.url} onClick={ctrl.onClick}>
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col fr-col-lg-12">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            <p class="fr-tag grey-text">SIREN: {@html ctrl.htmlSiren}</p>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            <p class="fr-tag grey-text">RNA: {@html ctrl.htmlRna}</p>
        </div>
        <div class="fr-col fr-col-lg-12">
            <p class="association-name grey-text">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html ctrl.htmlName}
            </p>
        </div>
    </div>
</Card>

<style>
    .association-name {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .grey-text {
        color: grey;
    }

    :global(.dsfr-black-bold) {
        color: black;
        font-weight: bold;
    }
</style>

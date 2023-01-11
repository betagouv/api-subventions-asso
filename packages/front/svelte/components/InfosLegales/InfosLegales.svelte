<script>
    import { addressToString, getSiegeSiret } from "../../views/association/association.helper";
    import Button from "../../dsfr/Button.svelte";
    import TitleWithData from "../TitleWithData.svelte";
    import InfosLegalesController from "./InfosLegales.controller";

    export let association;

    const controller = new InfosLegalesController(association);
</script>

<div class="summary">
    <div>
        <TitleWithData label="SIRET du siège" data={getSiegeSiret(association)} />
    </div>
    <div>
        <TitleWithData label="Objet social" data={association.objet_social} />
    </div>
    <div>
        <TitleWithData
            label="Adresse du siège"
            data={addressToString(association.adresse_siege_rna || association.adresse_siege_siren)} />
        <Button ariaControls="fr-modal" on:click={() => controller.displayModal()}>Plus de détails</Button>
    </div>
</div>
<slot />

<style>
    .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }

    .title ::slotted(*:last-child) {
        flex-shrink: 0;
    }

    h1 {
        margin-bottom: 48px;
    }

    .summary {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 24px;
    }
</style>

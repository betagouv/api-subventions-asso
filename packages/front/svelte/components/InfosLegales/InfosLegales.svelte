<script>
    import { getAddress, getSiegeSiret } from "../../views/association/association.helper";
    import { modal } from "../../store/modal.store";
    import Button from "../../dsfr/Button.svelte";
    import TitleWithData from "../TitleWithData.svelte";
    import MoreInfoLegalesModal from "./MoreInfoLegalesModal.svelte";

    export let association;

    const displayModal = () => modal.update(() => MoreInfoLegalesModal);
</script>

<div class="title">
    <h1>{association.denomination_rna || association.denomination_siren}</h1>
    <slot name="action" />
</div>
<div>
    <slot name="subtitle" />
</div>
<div class="summary">
    <div>
        <TitleWithData label="RNA" data={association.rna} />
        <TitleWithData label="SIREN" data={association.siren} />
        <TitleWithData label="SIRET du siège" data={getSiegeSiret(association)} />
    </div>
    <div>
        <TitleWithData label="Objet social" data={association.objet_social} />
    </div>
    <div>
        <TitleWithData
            label="Adresse du siège"
            data={getAddress(association.adresse_siege_rna || association.adresse_siege_siren)} />
    </div>
    <Button on:click={displayModal}>Plus de détails</Button>
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

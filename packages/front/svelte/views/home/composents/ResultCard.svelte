<script>
    import Card from "../../../dsfr/Card.svelte";
    import { siretToSiren } from "../../../helpers/sirenHelper";
    import { isStartOfSiret } from "../../../helpers/validatorHelper";

    export let association;
    export let searchValue;

    let value = searchValue.trim();
    if (isStartOfSiret(searchValue)) {
        value = siretToSiren(searchValue);
    }

    const name = association.name || "-";
    const rna = association.rna || "INCONNU";
    const siren = association.siren || "INCONNU";

    const regex = new RegExp(value, "ig");
    const upperSearchedValue = value.toUpperCase();

    const htmlName = name.replace(regex, `<span class="home_resultCard_search-key">${upperSearchedValue}</span>`);
    const htmlRna = rna.replace(regex, `<span class="home_resultCard_search-key">${upperSearchedValue}</span>`);
    const htmlSiren = siren.replace(regex, `<span class="home_resultCard_search-key">${upperSearchedValue}</span>`);
</script>

<Card size="12" url="/association/{association.rna || association.siren}">
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col fr-col-lg-12">
            <p class="fr-tag grey-text">SIREN: {@html htmlSiren}</p>
            <p class="fr-tag grey-text">RNA: {@html htmlRna}</p>
        </div>
        <div class="fr-col fr-col-lg-12">
            <p class="association-name grey-text">
                {@html htmlName}
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

    :global(.home_resultCard_search-key) {
        color: black;
        font-weight: bold;
    }
</style>
<script>
    import { getAddress } from "../association.helper";
    import TitleWithData from "../../../components/TitleWithData.svelte";
    import DateHelper from "../../../../src/shared/helpers/DateHelper";

    export let association;

    const creationDate = DateHelper.formatDate(association.date_creation);
    const updateDate = DateHelper.formatDate(association.date_modification);
    const address = getAddress(association.adresse_siege);
</script>

<h1>{association.denomination}</h1>
<div class="grid">
    <div>
        <TitleWithData label="RNA" data={association.rna} />
        <TitleWithData label="SIREN" data={association.siren} />
        <TitleWithData label="SIRET du siège" data={association.siren + association.nic_siege} />
    </div>
    <div>
        <TitleWithData label="Objet social" data={association.objet_social} />
    </div>
    <div>
        <TitleWithData label="Adresse du siège" data={address} />
        <TitleWithData label="Date d'immatriculation" data={creationDate} />
        {#if association.date_modification}
            <TitleWithData label="Dernière modification au greffe" data={updateDate} />
        {/if}
    </div>
</div>

<style>
    h1 {
        margin-bottom: 48px;
    }

    .grid {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 24px;
        margin-bottom: 72px;
    }
</style>

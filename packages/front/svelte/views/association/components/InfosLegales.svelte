<script>
    import { getAddress } from "../association.helper";
    import TitleWithData from "../../../components/TitleWithData.svelte";
    import DateHelper from "../../../../src/shared/helpers/DateHelper";
    import Table from "../../../dsfr/Table.svelte";
    import { valueOrHyphen } from "../../../helpers/dataHelper";

    export let association;
</script>

<h1>{association.denomination_rna || association.denomination_siren}</h1>
<div class="summary">
    <div>
        <TitleWithData label="RNA" data={association.rna} />
        <TitleWithData label="SIREN" data={association.siren} />
        <TitleWithData label="SIRET du siège" data={association.siren + association.nic_siege} />
    </div>
    <div>
        <TitleWithData label="Objet social" data={association.objet_social} />
    </div>
    <div>
        <TitleWithData
            label="Adresse du siège"
            data={getAddress(association.adresse_siege_rna || association.adresse_siege_siren)} />
    </div>
</div>
<div class="rna-siren">
    <Table bordered={false}>
        <svelte:fragment slot="head">
            <td class="two-dimension" />
            <td>Informations provenant du RNA</td>
            <td>Informations provenant du SIREN</td>
        </svelte:fragment>
        <svelte:fragment slot="body">
            <tr>
                <td class="two-dimension"><b>Dénomination</b></td>
                <td>{valueOrHyphen(association.denomination_rna)}</td>
                <td>{valueOrHyphen(association.denomination_siren)}</td>
            </tr>
            <tr>
                <td class="two-dimension"><b>Adresse du siège</b></td>
                <td>{valueOrHyphen(getAddress(association.adresse_siege_rna))}</td>
                <td>{valueOrHyphen(getAddress(association.adresse_siege_siren))}</td>
            </tr>
            <tr>
                <td class="two-dimension"><b>Date d'immatriculation</b></td>
                <td>{association.date_creation_rna ? DateHelper.formatDate(association.date_creation_rna): '-'}</td>
                <td>{association.date_creation_siren ? DateHelper.formatDate(association.date_creation_siren): '-'}</td>
            </tr>
            <tr>
                <td class="two-dimension"><b>Date de modification</b></td>
                <td>{association.date_modification_rna ? DateHelper.formatDate(association.date_modification_rna): '-'}</td>
                <td>{association.date_creation_siren ? DateHelper.formatDate(association.date_creation_siren): '-'}</td>
            </tr>
        </svelte:fragment>
    </Table>
</div>

<style>
    h1 {
        margin-bottom: 48px;
    }

    .rna-siren {
        margin-bottom: 72px;
    }

    .summary {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 24px;
    }
</style>

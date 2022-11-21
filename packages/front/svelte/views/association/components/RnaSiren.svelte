<script>
    import DateHelper from "../../../../src/shared/helpers/DateHelper";
    import Table from "../../../dsfr/Table.svelte";
    import { valueOrHyphen } from "../../../helpers/dataHelper"
    import { getAddress } from "../association.helper";
    export let association;
</script>

<style>
    .rna-siren {
        margin-bottom: 72px;
    }
</style>

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
                <td>{association.date_creation_rna ? DateHelper.formatDate(association.date_creation_rna) : "-"}</td>
                <td>
                    {association.date_creation_siren ? DateHelper.formatDate(association.date_creation_siren) : "-"}
                </td>
            </tr>
            <tr>
                <td class="two-dimension"><b>Date de modification</b></td>
                <td>
                    {association.date_modification_rna ? DateHelper.formatDate(association.date_modification_rna) : "-"}
                </td>
                <td>
                    {association.date_creation_siren ? DateHelper.formatDate(association.date_creation_siren) : "-"}
                </td>
            </tr>
        </svelte:fragment>
    </Table>
</div>
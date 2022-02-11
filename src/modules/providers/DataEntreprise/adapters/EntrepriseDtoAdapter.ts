import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import Association from "../../../associations/interfaces/Association";
import EntrepriseDto from "../interfaces/EntrepriseDto";

export default class EntrepriseDtoAdapter {
    static PROVIDER_NAME = "EntrepriseData <https://entreprise.data.gouv.fr>";

    static toAssociation(data: EntrepriseDto): Association {
        return {
            rna: ProviderValueAdapter.toProviderValue(data.unite_legale.identifiant_association, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            siren: ProviderValueAdapter.toProviderValue(data.unite_legale.siren, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            nic_siege: ProviderValueAdapter.toProviderValue(data.unite_legale.nic_siege, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            categorie_juridique: ProviderValueAdapter.toProviderValue(data.unite_legale.categorie_juridique, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            date_creation: ProviderValueAdapter.toProviderValue(new Date(data.unite_legale.date_creation), EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            date_modification: ProviderValueAdapter.toProviderValue(new Date(data.unite_legale.updated_at), EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            denomination: ProviderValueAdapter.toProviderValue(data.unite_legale.denomination, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            denominations_usuelle: ProviderValueAdapter.toProviderValue([
                data.unite_legale.denomination_usuelle_1,
                data.unite_legale.denomination_usuelle_2,
                data.unite_legale.denomination_usuelle_3,
            ].filter(d => d) as string[], EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
        }
    }
}
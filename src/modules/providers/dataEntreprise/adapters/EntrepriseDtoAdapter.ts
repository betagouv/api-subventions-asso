import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import Association from "../../../associations/interfaces/Association";
import EntrepriseDto from "../dto/EntrepriseDto";

export default class EntrepriseDtoAdapter {
    static PROVIDER_NAME = "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>";

    static toAssociation(data: EntrepriseDto): Association {
        return {
            rna: data.unite_legale.identifiant_association 
                ? ProviderValueAdapter.toProviderValues(data.unite_legale.identifiant_association, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at))
                : undefined,
            siren: ProviderValueAdapter.toProviderValues(data.unite_legale.siren, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            nic_siege: ProviderValueAdapter.toProviderValues(data.unite_legale.nic_siege, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            categorie_juridique: ProviderValueAdapter.toProviderValues(data.unite_legale.categorie_juridique, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            date_creation: ProviderValueAdapter.toProviderValues(new Date(data.unite_legale.date_creation), EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            date_modification: ProviderValueAdapter.toProviderValues(new Date(data.unite_legale.updated_at), EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            denomination: ProviderValueAdapter.toProviderValues(data.unite_legale.denomination, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            adresse_siege: ProviderValueAdapter.toProviderValues({
                numero:data.unite_legale.etablissement_siege.numero_voie,
                type_voie:data.unite_legale.etablissement_siege.type_voie,
                voie:data.unite_legale.etablissement_siege.libelle_voie,
                code_postal:data.unite_legale.etablissement_siege.code_postal,
                commune:data.unite_legale.etablissement_siege.libelle_commune,
            }, EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
            etablisements_siret: ProviderValueAdapter.toProviderValues(
                data.unite_legale.etablissements.map(e => e.siret)
                , EntrepriseDtoAdapter.PROVIDER_NAME, new Date(data.unite_legale.updated_at)),
        }
    }
}
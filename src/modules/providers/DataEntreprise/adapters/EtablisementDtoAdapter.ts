import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import Etablissement from "../../../etablissements/interfaces/Etablissement";
import EtablisementDto from "../interfaces/EtablissementDto";

export default class EtablissementDtoAdapter {
    static PROVIDER_NAME = "EntrepriseData <https://entreprise.data.gouv.fr>";

    static toEtablissement(dto: EtablisementDto): Etablissement {
        return {
            siret: ProviderValueAdapter.toProviderValue(dto.etablissement.siret, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.etablissement.updated_at)),
            siege: ProviderValueAdapter.toProviderValue(dto.etablissement.unite_legale.nic_siege === dto.etablissement.nic, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.etablissement.updated_at)),
            nic: ProviderValueAdapter.toProviderValue(dto.etablissement.nic, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.etablissement.updated_at)),
            adresse: {
                numero: ProviderValueAdapter.toProviderValue(dto.etablissement.numero_voie, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.etablissement.updated_at)),
                type_voie: ProviderValueAdapter.toProviderValue(dto.etablissement.type_voie, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.etablissement.updated_at)),
                voie: ProviderValueAdapter.toProviderValue(dto.etablissement.libelle_voie, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.etablissement.updated_at)),
                code_postal: ProviderValueAdapter.toProviderValue(dto.etablissement.code_postal, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.etablissement.updated_at)),
                commune: ProviderValueAdapter.toProviderValue(dto.etablissement.libelle_commune, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.etablissement.updated_at)),
            },
        }
    }
}
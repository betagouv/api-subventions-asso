import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import { Etablissement } from "@api-subventions-asso/dto";
import EtablisementDto from "../dto/EtablissementDto";

export default class EtablissementDtoAdapter {
    static PROVIDER_NAME = "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>";

    static toEtablissement(dto: EtablisementDto): Etablissement {
        return {
            siret: ProviderValueAdapter.toProviderValues(dto.siret, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.updated_at)),
            siege: dto.unite_legale ? ProviderValueAdapter.toProviderValues(dto.unite_legale.nic_siege === dto.nic, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.updated_at)) : undefined,
            nic: ProviderValueAdapter.toProviderValues(dto.nic, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.updated_at)),
            adresse: ProviderValueAdapter.toProviderValues({
                numero:dto.numero_voie,
                type_voie:dto.type_voie,
                voie:dto.libelle_voie,
                code_postal:dto.code_postal,
                commune:dto.libelle_commune,
            }, EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.updated_at)),
            ouvert: dto.etat_administratif ? ProviderValueAdapter.toProviderValues(dto.etat_administratif !== "F", EtablissementDtoAdapter.PROVIDER_NAME, new Date(dto.updated_at)): undefined,
        }
    }
}
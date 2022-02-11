import ProviderValueAdapter from "../../../shared/adapters/ProviderValueAdapter";
import Association from "../../associations/interfaces/Association";
import Etablissement from "../../etablissements/interfaces/Etablissement";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";

export default class OsirisRequestAdapter {
    static PROVIDER_NAME = "Osiris"

    static toAssociation(entity: OsirisRequestEntity): Association {
        return {
            siren: ProviderValueAdapter.toProviderValue(entity.legalInformations.siret.slice(0,9), OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
            rna: ProviderValueAdapter.toProviderValue(entity.legalInformations.rna, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
            denomination: ProviderValueAdapter.toProviderValue(entity.legalInformations.name, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
        }
    }

    static toEtablissement(entity: OsirisRequestEntity): Etablissement {
        return {
            siret: ProviderValueAdapter.toProviderValue(entity.legalInformations.siret, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
            nic: ProviderValueAdapter.toProviderValue(entity.legalInformations.siret.slice(9,14), OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
            siege: ProviderValueAdapter.toProviderValue(entity.providerInformations.etablissementSiege, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
            adresse: {
                voie: ProviderValueAdapter.toProviderValue(entity.providerInformations.etablissementVoie, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
                code_postal: ProviderValueAdapter.toProviderValue(entity.providerInformations.etablissementCodePostal, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
                commune: ProviderValueAdapter.toProviderValue(entity.providerInformations.etablissementCommune, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
            },
            representants_legaux: [
                {
                    nom: ProviderValueAdapter.toProviderValue(entity.providerInformations.representantNom, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
                    prenom: ProviderValueAdapter.toProviderValue(entity.providerInformations.representantPrenom, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
                    civilite: ProviderValueAdapter.toProviderValue(entity.providerInformations.representantCivilite, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
                    role: ProviderValueAdapter.toProviderValue(entity.providerInformations.representantRole, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
                    telephone: ProviderValueAdapter.toProviderValue(entity.providerInformations.representantPhone, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
                    email: ProviderValueAdapter.toProviderValue(entity.providerInformations.representantEmail, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission),
                }
            ],
            information_banquaire: [
                ProviderValueAdapter.toProviderValue({
                    bic: entity.providerInformations.etablissementBIC,
                    iban: entity.providerInformations.etablissementIBAN,
                }, OsirisRequestAdapter.PROVIDER_NAME, entity.providerInformations.dateCommission)
            ]
        }
    }
}
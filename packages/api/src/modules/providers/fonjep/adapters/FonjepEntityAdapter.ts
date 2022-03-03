import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import DemandeSubvention from "../../../demandes_subventions/interfaces/DemandeSubvention";
import Etablissement from "../../../etablissements/interfaces/Etablissement";
import FonjepRequestEntity from "../entities/FonjepRequestEntity";

export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep"
    
    static toDemandeSubvention(entity: FonjepRequestEntity): DemandeSubvention {
        const dataDate = entity.indexedInformations.date_versement
        return {
            service_instructeur: ProviderValueAdapter.toProviderValue(entity.indexedInformations.service_instructeur, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            status: ProviderValueAdapter.toProviderValue(entity.indexedInformations.status, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            annee_demande: ProviderValueAdapter.toProviderValue(entity.indexedInformations.annee_demande, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            financeur_principal: ProviderValueAdapter.toProviderValue(entity.indexedInformations.financeur_principal, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            montants: {
                accorde: ProviderValueAdapter.toProviderValue(entity.indexedInformations.montant_paye, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            }
        }
    }

    static toEtablissement(entity: FonjepRequestEntity): Etablissement {
        const dataDate = entity.indexedInformations.date_versement

        return {
            siret: ProviderValueAdapter.toProviderValues(entity.legalInformations.siret, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            nic: ProviderValueAdapter.toProviderValues(siretToNIC(entity.legalInformations.siret), FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            adresse: ProviderValueAdapter.toProviderValues({
                code_postal: entity.indexedInformations.code_postal,
                commune: entity.indexedInformations.ville
            }, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
        }
    }
}
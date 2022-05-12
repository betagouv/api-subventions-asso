import { DemandeSubvention, Etablissement } from "@api-subventions-asso/dto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import FonjepRequestEntity from "../entities/FonjepRequestEntity";

export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep"
    
    static toDemandeSubvention(entity: FonjepRequestEntity): DemandeSubvention {
        const dataDate = entity.indexedInformations.updated_at
        return {
            siret: ProviderValueAdapter.toProviderValue(entity.legalInformations.siret, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            service_instructeur: ProviderValueAdapter.toProviderValue(entity.indexedInformations.service_instructeur, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            status: ProviderValueAdapter.toProviderValue(entity.indexedInformations.status, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            annee_demande: ProviderValueAdapter.toProviderValue(entity.indexedInformations.annee_demande, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            date_fin: entity.indexedInformations.date_fin_triennale 
                ? ProviderValueAdapter.toProviderValue(entity.indexedInformations.date_fin_triennale, FonjepEntityAdapter.PROVIDER_NAME, dataDate)
                : undefined,
            montants: {
                accorde: ProviderValueAdapter.toProviderValue(entity.indexedInformations.montant_paye, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            },
            co_financement: entity.indexedInformations.co_financeur ? {
                cofinanceur: ProviderValueAdapter.toProviderValue(entity.indexedInformations.co_financeur as string, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
                cofinanceur_email: ProviderValueAdapter.toProviderValue(entity.indexedInformations.co_financeur_contact as string, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
                cofinanceur_siret: entity.indexedInformations.co_financeur_siret?.length != 0 
                    ? ProviderValueAdapter.toProviderValue(entity.indexedInformations.co_financeur_siret as string, FonjepEntityAdapter.PROVIDER_NAME, dataDate)
                    : undefined,
                montants: ProviderValueAdapter.toProviderValue(entity.indexedInformations.co_financeur_montant as number, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            } : undefined
        }
    }

    static toEtablissement(entity: FonjepRequestEntity): Etablissement {
        const dataDate = entity.indexedInformations.updated_at

        return {
            siret: ProviderValueAdapter.toProviderValues(entity.legalInformations.siret, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            nic: ProviderValueAdapter.toProviderValues(siretToNIC(entity.legalInformations.siret), FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            adresse: ProviderValueAdapter.toProviderValues({
                code_postal: entity.indexedInformations.code_postal,
                commune: entity.indexedInformations.ville
            }, FonjepEntityAdapter.PROVIDER_NAME, dataDate),
            contacts: [
                ProviderValueAdapter.toProviderValues({
                    email: entity.indexedInformations.contact
                }, FonjepEntityAdapter.PROVIDER_NAME, dataDate)
            ],
        }
    }
}
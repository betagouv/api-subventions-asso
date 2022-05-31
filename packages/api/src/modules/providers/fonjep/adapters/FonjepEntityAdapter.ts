import { DemandeSubvention, Etablissement } from "@api-subventions-asso/dto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import FonjepRequestEntity from "../entities/FonjepRequestEntity";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";

export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep"

    static toDemandeSubvention(entity: FonjepRequestEntity): DemandeSubvention {
        const dataDate = entity.indexedInformations.updated_at;
        const toProviderValue = ProviderValueFactory.buildProviderValueAdapter(FonjepEntityAdapter.PROVIDER_NAME, dataDate);
        return {
            siret: toProviderValue(entity.legalInformations.siret),
            service_instructeur: toProviderValue(entity.indexedInformations.service_instructeur),
            dispositif: toProviderValue("Fonjep"),
            status: toProviderValue(entity.indexedInformations.status),
            annee_demande: toProviderValue(entity.indexedInformations.annee_demande),
            date_fin: entity.indexedInformations.date_fin_triennale 
                ? toProviderValue(entity.indexedInformations.date_fin_triennale)
                : undefined,
            montants: {
                accorde: toProviderValue(entity.indexedInformations.montant_paye),
                demande: toProviderValue(entity.indexedInformations.montant_paye),
            },
            co_financement: entity.indexedInformations.co_financeur ? {
                cofinanceur: toProviderValue(entity.indexedInformations.co_financeur as string),
                cofinanceur_email: toProviderValue(entity.indexedInformations.co_financeur_contact as string),
                cofinanceur_siret: entity.indexedInformations.co_financeur_siret?.length != 0 
                    ? toProviderValue(entity.indexedInformations.co_financeur_siret as string)
                    : undefined,
                montants: toProviderValue(entity.indexedInformations.co_financeur_montant as number),
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
import { DemandeSubvention, Etablissement } from "@api-subventions-asso/dto";
import ProviderValueFactory from '../../../../shared/ProviderValueFactory';
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import FonjepRequestEntity from "../entities/FonjepRequestEntity";

export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep"

    static toDemandeSubvention(entity: FonjepRequestEntity): DemandeSubvention {
        const dataDate = entity.indexedInformations.updated_at;
        const toProviderValue = ProviderValueFactory.buildProviderValueAdapter(this.PROVIDER_NAME, dataDate);
        return {
            siret: toProviderValue(entity.legalInformations.siret),
            service_instructeur: toProviderValue(entity.indexedInformations.service_instructeur),
            dispositif: toProviderValue(this.PROVIDER_NAME),
            status: toProviderValue(entity.indexedInformations.status),
            pluriannualite: toProviderValue("Oui"),
            plein_temps: toProviderValue(entity.indexedInformations.plein_temps),
            annee_demande: toProviderValue(entity.indexedInformations.annee_demande),
            date_fin: toProviderValue(entity.indexedInformations.date_fin_triennale),
            montants: {
                accorde: toProviderValue(entity.indexedInformations.montant_paye),
                demande: toProviderValue(entity.indexedInformations.montant_paye),
            }
        }
    }

    static toEtablissement(entity: FonjepRequestEntity): Etablissement {
        const dataDate = entity.indexedInformations.updated_at;
        const toProviderValues = ProviderValueFactory.buildProviderValuesAdapter(this.PROVIDER_NAME, dataDate);

        return {
            siret: toProviderValues(entity.legalInformations.siret),
            nic: toProviderValues(siretToNIC(entity.legalInformations.siret)),
            adresse: toProviderValues({
                code_postal: entity.indexedInformations.code_postal,
                commune: entity.indexedInformations.ville
            }),
            contacts: [
                toProviderValues({
                    email: entity.indexedInformations.contact
                })
            ],
        }
    }
}
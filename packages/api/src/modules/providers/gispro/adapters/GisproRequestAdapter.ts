import DemandeSubvention from "api-subventions-asso-dto/search/DemandeSubventionDto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import GisproActionEntity from "../entities/GisproActionEntity";

export default class GisproRequestAdapter {
    static PROVIDER_NAME = "Gispro"

    public static toDemandeSubvention(entities: GisproActionEntity[]): DemandeSubvention {
        const dataDate = entities[0].providerInformations.importedDate;
        
        const data: DemandeSubvention = {
            siret: ProviderValueAdapter.toProviderValue(entities[0].providerInformations.siret, GisproRequestAdapter.PROVIDER_NAME, dataDate),
            service_instructeur: ProviderValueAdapter.toProviderValue(entities[0].providerInformations.direction, GisproRequestAdapter.PROVIDER_NAME, dataDate),
            status: ProviderValueAdapter.toProviderValue("Non communiquer par GISPRO", GisproRequestAdapter.PROVIDER_NAME, dataDate),
            montants: {
                accorde:  ProviderValueAdapter.toProviderValue(entities.reduce((total, entity) => total + entity.providerInformations.montant, 0), GisproRequestAdapter.PROVIDER_NAME, dataDate),
            },
            actions_proposee: entities.map(entity => ({
                intitule: ProviderValueAdapter.toProviderValue(entity.providerInformations.action, GisproRequestAdapter.PROVIDER_NAME, dataDate),
                montants_versement: {
                    accorde: ProviderValueAdapter.toProviderValue(entity.providerInformations.montant, GisproRequestAdapter.PROVIDER_NAME, dataDate),
                },
            }))
        }

        return data
    }
}
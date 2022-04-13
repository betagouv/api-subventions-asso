import DemandeSubvention from "@api-subventions-asso/dto/search/DemandeSubventionDto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import DemandeSubvention from "../../../demandes_subventions/interfaces/DemandeSubvention";
import GisproRequestEntity from "../entities/GisproRequestEntity";

export default class GisproRequestAdapter {
    static PROVIDER_NAME = "Gispro"

    public static toDemandeSubvention(entity: GisproRequestEntity): DemandeSubvention {
        const dataDate = new Date();
        
        const data: DemandeSubvention = {
            siret: ProviderValueAdapter.toProviderValue(entity.legalInformations.siret, GisproRequestAdapter.PROVIDER_NAME, dataDate),
            service_instructeur: ProviderValueAdapter.toProviderValue("TODO: FIND SERVICE_INSTRUCTEUR", GisproRequestAdapter.PROVIDER_NAME, dataDate),
            status: ProviderValueAdapter.toProviderValue("TODO: FIND STATUS", GisproRequestAdapter.PROVIDER_NAME, dataDate),
            dispositif: ProviderValueAdapter.toProviderValue(entity.providerInformations.dispositif, GisproRequestAdapter.PROVIDER_NAME, dataDate),
            sous_dispositif: ProviderValueAdapter.toProviderValue(entity.providerInformations.sous_dispositif, GisproRequestAdapter.PROVIDER_NAME, dataDate),
        }

        return data
    }
}
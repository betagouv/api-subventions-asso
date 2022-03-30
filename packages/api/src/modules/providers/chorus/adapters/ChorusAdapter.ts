import { WithId } from "mongodb";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import Versement from "../../../versements/interfaces/Versement";
import ChorusLineEntity from "../entities/ChorusLineEntity";

export default class ChorusAdapter {
    static PROVIDER_NAME = "Chorus"

    public static toVersement(entity: WithId<ChorusLineEntity>): Versement {
        return {
            id: entity._id.toString(),
            ej: ProviderValueAdapter.toProviderValue(entity.indexedInformations.ej, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
            siret: ProviderValueAdapter.toProviderValue(entity.indexedInformations.siret, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
            amount: ProviderValueAdapter.toProviderValue(entity.indexedInformations.amount, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
            dateOperation: ProviderValueAdapter.toProviderValue(entity.indexedInformations.dateOperation, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
            centreFinancier: ProviderValueAdapter.toProviderValue(entity.indexedInformations.centreFinancier, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
            domaineFonctionnel: ProviderValueAdapter.toProviderValue(entity.indexedInformations.domaineFonctionnel, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
            codeBranche: ProviderValueAdapter.toProviderValue(entity.indexedInformations.codeBranche, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
            branche: ProviderValueAdapter.toProviderValue(entity.indexedInformations.branche, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
            numeroDemandePayment: entity.indexedInformations.numeroDemandePayment
                ? ProviderValueAdapter.toProviderValue(entity.indexedInformations.numeroDemandePayment, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation)
                : undefined,
            numeroTier: entity.indexedInformations.numeroTier
                ? ProviderValueAdapter.toProviderValue(entity.indexedInformations.numeroTier, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation)
                : undefined,
            activitee: entity.indexedInformations.activitee
                ? ProviderValueAdapter.toProviderValue(entity.indexedInformations.activitee, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation)
                : undefined,
            compte: entity.indexedInformations.compte
                ? ProviderValueAdapter.toProviderValue(entity.indexedInformations.compte, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation)
                : undefined,
            type: entity.indexedInformations.typeOperation
                ? ProviderValueAdapter.toProviderValue(entity.indexedInformations.typeOperation, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation)
                : undefined,
        }
    }
}
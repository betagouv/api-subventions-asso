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
            compte: ProviderValueAdapter.toProviderValue(entity.indexedInformations.compte, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
            codeBranche: ProviderValueAdapter.toProviderValue(entity.indexedInformations.codeBranche, ChorusAdapter.PROVIDER_NAME, entity.indexedInformations.dateOperation),
        }
    }
}
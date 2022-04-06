import Association from "../../../associations/@types/Association";
import LeCompteAssoRequestEntity from "../entities/LeCompteAssoRequestEntity";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import { siretToNIC, siretToSiren } from "../../../../shared/helpers/SirenHelper";
import Etablissement from "../../../etablissements/@types/Etablissement";

export default class LeCompteAssoRequestAdapter {
    static PROVIDER_NAME = "LeCompteAsso"

    public static toAssociation(entity: LeCompteAssoRequestEntity): Association {
        const dataDate = entity.providerInformations.transmis_le
        return {
            siren: ProviderValueAdapter.toProviderValues(siretToSiren(entity.legalInformations.siret), LeCompteAssoRequestAdapter.PROVIDER_NAME, dataDate),
            rna: ProviderValueAdapter.toProviderValues(entity.legalInformations.rna, LeCompteAssoRequestAdapter.PROVIDER_NAME, dataDate),
            denomination: ProviderValueAdapter.toProviderValues(entity.legalInformations.name, LeCompteAssoRequestAdapter.PROVIDER_NAME, dataDate),
        }
    }

    public static toEtablissement(entity: LeCompteAssoRequestEntity): Etablissement {
        const dataDate = entity.providerInformations.transmis_le

        return {
            siret: ProviderValueAdapter.toProviderValues(entity.legalInformations.siret, LeCompteAssoRequestAdapter.PROVIDER_NAME, dataDate),
            nic: ProviderValueAdapter.toProviderValues(siretToNIC(entity.legalInformations.siret), LeCompteAssoRequestAdapter.PROVIDER_NAME, dataDate),
            contacts: entity.providerInformations.createur_email ? [
                ProviderValueAdapter.toProviderValues({
                    email: entity.providerInformations.createur_email,
                }, LeCompteAssoRequestAdapter.PROVIDER_NAME, dataDate)
            ]: undefined
        }
    }
}
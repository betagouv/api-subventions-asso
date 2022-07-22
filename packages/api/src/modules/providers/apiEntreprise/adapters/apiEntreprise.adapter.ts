import { Etablissement } from "@api-subventions-asso/dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";

export default class ApiEntrepriseAdapter {
    static PROVIDER_NAME = "API ENTREPRISE"

    static toEtablissement(etablissement: { siret: string, nic: string, headcount?: string }): Etablissement {
        const toProviderValues = ProviderValueFactory.buildProviderValuesAdapter(this.PROVIDER_NAME, new Date());

        return {
            siret: toProviderValues(etablissement.siret),
            nic: toProviderValues(etablissement.nic),
            headcount: etablissement.headcount ? toProviderValues(etablissement.headcount) : undefined
        }
    }
}
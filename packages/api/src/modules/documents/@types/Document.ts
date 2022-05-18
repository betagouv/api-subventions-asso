import { Siret, ProviderValue } from "@api-subventions-asso/dto";

export default interface Document {
    type: ProviderValue<string>
    url: ProviderValue<string>
    nom: ProviderValue<string>
    __meta__ : {
        siret ?: Siret
    }
}
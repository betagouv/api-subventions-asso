import { Siret, ProviderValue } from "..";

export interface Document {
    type: ProviderValue<string>
    url: ProviderValue<string>
    nom: ProviderValue<string>
    __meta__: {
        siret?: Siret
    }
}
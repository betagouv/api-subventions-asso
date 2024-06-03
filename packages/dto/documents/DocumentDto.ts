import { Siret, ProviderValue } from "..";

export interface DocumentDto {
    // TODO list possible types ?
    type: ProviderValue<string>; // ex : RIB, attestation, insee status...
    url: ProviderValue<string>;
    nom: ProviderValue<string>;
    __meta__: {
        siret?: Siret;
    };
}

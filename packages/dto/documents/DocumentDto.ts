import { Siret, ProviderValue } from "..";

export interface DocumentDto {
    type: ProviderValue<string>; // TODO list possible types ?
    url: ProviderValue<string>;
    nom: ProviderValue<string>;
    __meta__: {
        siret?: Siret;
    };
}

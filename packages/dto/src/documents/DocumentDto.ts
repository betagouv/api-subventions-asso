import { SiretDto, ProviderValue } from "../shared";

export interface DocumentDto {
    /** Type de document (ex : RIB, attestation, statuts INSEE...) */
    type: ProviderValue<string>;
    /** URL d'accès au document */
    url: ProviderValue<string>;
    /** Nom du document */
    nom: ProviderValue<string>;
    __meta__: {
        siret?: SiretDto;
    };
}

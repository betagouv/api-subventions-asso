import { ProviderValue, Siret } from "../../../@types";

export default interface Versement {
    id: string,
    ej: ProviderValue<string>;
    siret: ProviderValue<Siret>;
    amount: ProviderValue<number>;
    dateOperation: ProviderValue<Date>;
    centreFinancier: ProviderValue<string>
    domaineFonctionnel: ProviderValue<string>,
    compte?: ProviderValue<string>;
    codeBranche?: ProviderValue<string>;
    branche?: ProviderValue<string>;
    type?: ProviderValue<string>;
}
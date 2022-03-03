import ProviderValue from "../../../@types/ProviderValue";
import { Siret } from "../../../@types/Siret";


export default interface Versement {
    id: string,
    ej: ProviderValue<string>;
    siret: ProviderValue<Siret>;
    amount: ProviderValue<number>;
    dateOperation: ProviderValue<Date>;
    compte?: ProviderValue<string>;
    codeBranche?: ProviderValue<string>;
    type?: ProviderValue<string>;
}
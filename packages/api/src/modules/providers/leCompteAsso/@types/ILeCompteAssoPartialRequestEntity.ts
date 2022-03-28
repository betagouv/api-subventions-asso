import { Siret } from "../../../../@types";
import ILeCompteAssoRequestInformations from "./ILeCompteAssoRequestInformations";

export default interface ILeCompteAssoPartialRequestEntity {
    legalInformations: {siret: Siret, name: string},
    providerInformations: ILeCompteAssoRequestInformations,
    data: unknown
}
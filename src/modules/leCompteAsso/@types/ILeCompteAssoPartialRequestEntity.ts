import ILeCompteAssoRequestInformations from "./ILeCompteAssoRequestInformations";

export default interface ILeCompteAssoPartialRequestEntity {
    legalInformations: {siret: string, name: string},
    providerInformations: ILeCompteAssoRequestInformations,
    data: unknown
}
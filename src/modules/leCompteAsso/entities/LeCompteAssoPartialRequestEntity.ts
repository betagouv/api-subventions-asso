import ILeCompteAssoRequestInformations from "../@types/ILeCompteAssoRequestInformations";

export default interface LeCompteAssoPartialRequestEntity {
    legalInformations: {siret: string, name: string},
    providerInformations: ILeCompteAssoRequestInformations,
    data: unknown
}
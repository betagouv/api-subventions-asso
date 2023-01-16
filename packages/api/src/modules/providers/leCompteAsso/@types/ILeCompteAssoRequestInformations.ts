import IProviderInformations from "../../../search/@types/IProviderInformations";

export default interface ILeCompteAssoRequestInformations extends IProviderInformations {
    compteAssoId: string;
    transmis_le: Date;
    createur_email: string;
}

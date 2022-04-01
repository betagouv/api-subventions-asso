import IProviderInformations from "../../../search/@types/IProviderInformations";

export default interface IGisproRequestInformations extends IProviderInformations {
    gisproId: string;
    dispositif: string;
    sous_dispositif: string;
    montantsTotal: number;
}
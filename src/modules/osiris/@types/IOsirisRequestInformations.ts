import IProviderInformations from "../../search/@types/IProviderInformations";

export default interface IOsirisRequestInformations extends IProviderInformations {
    osirisId: string;
    compteAssoId: string;
    ej: string;
    amountAwarded: number;
    dateCommission: Date;
}
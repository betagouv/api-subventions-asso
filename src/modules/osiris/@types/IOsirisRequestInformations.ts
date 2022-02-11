import IProviderInformations from "../../search/@types/IProviderInformations";

export default interface IOsirisRequestInformations extends IProviderInformations {
    osirisId: string;
    compteAssoId: string;
    ej: string;
    amountAwarded: number;
    dateCommission: Date;
    etablissementSiege: boolean
    etablissementVoie: string
    etablissementCodePostal: string
    etablissementCommune: string
    etablissementIBAN: string
    etablissementBIC: string

    representantNom: string
    representantPrenom: string
    representantRole: string
    representantCivilite: string
    representantEmail: string
    representantPhone: string,
}
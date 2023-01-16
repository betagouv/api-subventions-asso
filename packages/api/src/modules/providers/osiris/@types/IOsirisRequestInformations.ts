import IProviderInformations from "../../../search/@types/IProviderInformations";

export default interface IOsirisRequestInformations extends IProviderInformations {
    osirisId: string;
    compteAssoId: string;
    ej: string;
    amountAwarded: number;
    dateCommission?: Date;
    exerciceDebut: Date;
    etablissementSiege: boolean;
    etablissementVoie: string;
    etablissementCodePostal: string;
    etablissementCommune: string;
    etablissementIBAN: string;
    etablissementBIC: string;

    representantNom: string;
    representantPrenom: string;
    representantRole: string;
    representantCivilite: string;
    representantEmail: string;
    representantPhone: string;

    service_instructeur: string;
    dispositif: string;
    sous_dispositif: string;
    status: string;
    pluriannualite: string;

    montantsTotal: number;
    montantsDemande: number;
    montantsPropose: number;
    montantsAccorde: number;

    versementAcompte: number;
    versementSolde: number;
    versementRealise: number;
    versementCompensationN1: number;
    versementCompensationN: number;

    extractYear: number;
}

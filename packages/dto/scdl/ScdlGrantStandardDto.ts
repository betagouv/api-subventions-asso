import { SiretDto } from "../shared";

export interface ScdlGrantStandardDto {
    nomAttribuant: string;
    idAttribuant: SiretDto;
    exercice: number;
    dateConvention?: string;
    referenceDecision?: string;
    nomBeneficiaire?: string;
    idBeneficiaire: string;
    rnaBeneficiaire?: string;
    objet?: string;
    montant: number;
    nature?: string;
    conditionsVersement?: string;
    datePeriodeVersement?: string;
    idRAE?: string;
    notificationUE?: "oui" | "non";
    pourcentageSubvention?: number;
    dispositifAide?: string;
}

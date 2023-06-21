import { Siret } from "../shared/Siret";

export type EtalabGrant = {
    nomAttribuant: string;
    idAttribuant: string;
    dateConvention: string; // date formatted as 2027-06-06
    referenceDecision: string;
    nomBeneficiaire: string;
    idBeneficiaire: Siret;
    objet: string;
    montant: number; // granted amount
    nature:
        | "aide en numéraire"
        | "aide en nature"
        | "aide en numéraire;aide en nature"
        | "aide en nature;aide en numéraire"; // "aide en numéraire"
    conditionsVersement: "unique" | "échelonné" | "autre";
    datesPeriodeVersement: string; // date or date/date
    idRAE?: string; // about companies
    notificationUE: "oui" | "non";
    pourcentageSubvention: number;
};

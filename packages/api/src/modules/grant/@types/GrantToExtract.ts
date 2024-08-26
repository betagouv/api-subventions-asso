import { ApplicationStatus } from "dto";

export type GrantToExtract = {
    // general part
    assoName: string;
    assoRna: string;
    estabAddress: string;

    // application part
    exercice: number;
    siret: string;
    postalCode?: string;
    instructor?: string;
    measure?: string;
    action?: string;
    askedAmount?: number;
    grantedAmount?: number;
    status?: ApplicationStatus;

    // payments part
    paidAmount?: number;
    financialCenter?: string;
    paymentDate?: string;
    program?: string;
};

export enum ExtractHeaderLabel {
    // general part
    assoName = "Nom de l'association",
    assoRna = "RNA de l'association",
    estabAddress = "Adresse de l'établissement",

    // application part
    exercice = "Exercice de la demande",
    siret = "Siret",
    postalCode = "Code postal demandeur",
    instructor = "Service instructeur",
    measure = "Dispositif",
    action = "Intitulé de l'action",
    askedAmount = "Montant demandé",
    grantedAmount = "Montant accordé",
    status = "Statut de la demande",

    // payments part
    paidAmount = "Montant versé",
    financialCenter = "Centre financier du dernier paiement",
    paymentDate = "Date du dernier paiement",
    program = "Programme des paiements",
}

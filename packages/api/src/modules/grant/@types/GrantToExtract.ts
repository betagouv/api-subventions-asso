import { ApplicationStatus } from "dto";

export type GrantToExtract = {
    siret: string;
    // postalCode?: string; TODO
    instructor?: string;
    measure?: string;
    action?: string;
    askedAmount?: number;
    grantedAmount?: number;
    status?: ApplicationStatus;
    paidAmount?: number;
    financialCenter?: string;
    paymentDate?: string;
    program?: string;
};

export enum ExtractHeaderLabel {
    siret = "Siret",
    // postalCode = "Code postal demandeur", TODO
    instructor = "Service instructeur",
    measure = "Dispositif",
    action = "Intitulé de l'action",
    askedAmount = "Montant demandé",
    grantedAmount = "Montant accordé",
    status = "Statut de la demande",
    paidAmount = "Montant versé",
    financialCenter = "Centre financier du dernier paiement",
    paymentDate = "Date du dernier paiement",
    program = "Programme des paiements",
}

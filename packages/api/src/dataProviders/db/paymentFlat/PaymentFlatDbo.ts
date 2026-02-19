import type { FlatDbo } from "../@types/FlatDbo";

interface MandatoryPaymentFlatDbo extends FlatDbo {
    exerciceBudgetaire: number; // not in flat dbo because it can be null in application flat
    idVersement: string;
    montant: number;
    dateOperation: Date;
    numeroProgramme: number;
}

interface OptionalPaymentFlatDbo {
    ej: string | null;
    programme: string | null;
    mission: string | null;
    ministere: string | null;
    sigleMinistere: string | null;
    codeAction: string | null;
    action: string | null;
    codeActivite: string | null;
    activite: string | null;

    // Chorus specific data
    regionAttachementComptable: string | "N/A" | null;
    codeCentreFinancier: string | "N/A";
    libelleCentreFinancier: string | "N/A" | null;
    attachementComptable: string | "N/A";
}

type PaymentFlatDbo = MandatoryPaymentFlatDbo & OptionalPaymentFlatDbo;

export default PaymentFlatDbo;

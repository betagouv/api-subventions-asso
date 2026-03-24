import { CommonFlatDto } from "./shared";

export interface PaymentFlatDto extends CommonFlatDto {
    idVersement: string;
    exerciceBudgetaire: number;
    montant: number;
    dateOperation: Date;
    codeCentreFinancier: string | "N/A";
    libelleCentreFinancier: string | "N/A" | null;
    attachementComptable: string | "N/A";
    regionAttachementComptable: string | "N/A" | "code region inconnu";
    ej: string | null;
    programme: string | null;
    numeroProgramme: number;
    mission: string | null;
    ministere: string | null;
    sigleMinistere: string | null;
    codeAction: string | null;
    action: string | null;
    codeActivite: string | null;
    activite: string | null;
}

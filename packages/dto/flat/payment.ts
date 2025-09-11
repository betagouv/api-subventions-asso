import { CompanyIdName, EstablishmentIdName } from "./shared";

export interface PaymentFlatDto {
    uniqueId: string;
    idVersement: string;
    exerciceBudgetaire: number;
    typeIdEtablissementBeneficiaire: EstablishmentIdName;
    idEtablissementBeneficiaire: string;
    typeIdEntrepriseBeneficiaire: CompanyIdName;
    idEntrepriseBeneficiaire: string;
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
    provider: string;
}

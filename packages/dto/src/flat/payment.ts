import { CommonFlatDto } from "./shared";

export interface PaymentFlatDto extends CommonFlatDto {
    /** Identifiant unique du versement */
    idVersement: string;
    /**
     * Année de l'exercice budgétaire.
     * @example 2024
     */
    exerciceBudgetaire: number;
    /**
     * Montant versé en euros.
     * @example 5000
     */
    montant: number;
    /** Date de l'opération comptable */
    dateOperation: Date;
    /** Code du centre financier Chorus */
    codeCentreFinancier: string | "N/A";
    /** Libellé du centre financier Chorus */
    libelleCentreFinancier: string | "N/A" | null;
    /** Référence de pièce comptable */
    attachementComptable: string | "N/A";
    /** Région d'attachement comptable */
    regionAttachementComptable: string | "N/A" | null;
    /** Engagement juridique associé */
    ej: string | null;
    /** Libellé du programme budgétaire (LOLF) */
    programme: string | null;
    /**
     * Numéro du programme budgétaire (LOLF).
     * @example 163
     */
    numeroProgramme: string;
    /** Libellé de la mission budgétaire */
    mission: string | null;
    /** Libellé du ministère */
    ministere: string | null;
    /** Sigle du ministère */
    sigleMinistere: string | null;
    /** Code de l'action budgétaire */
    codeAction: string | null;
    /** Libellé de l'action budgétaire */
    action: string | null;
    /** Code de l'activité budgétaire */
    codeActivite: string | null;
    /** Libellé de l'activité budgétaire */
    activite: string | null;
}

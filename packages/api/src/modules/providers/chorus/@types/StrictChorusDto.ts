export interface StrictChorusDto {
    "N° EJ": string;
    "N° poste EJ": string;
    "Code taxe 1": string;
    "No TVA 3 (COM-RIDET ou TAHITI)": string;
    "Branche CODE": string;
    Branche: string;
    "Référentiel de programmation": string;
    "Référentiel de programmation CODE": string;
    "N° DP": string;
    "N° poste DP": string;
    Société: string;
    "Exercice comptable": string;
    "Fournisseur payé (DP)": string;
    "Désignation de la structure": string;
    "Centre financier": string;
    "Centre financier CODE": string;
    "Domaine fonctionnel": string;
    "Domaine fonctionnel CODE": string;
    "Montant payé": number;
    // XLSX date can be string (YYYY/MM/DD) or ExcelDateNumber (44856)
    "Date de dernière opération sur la DP": string | number;
}

export interface ChorusDto {
    "N° EJ": string | null;
    "N° poste EJ": string | null;
    "Code taxe 1": string;
    "No TVA 3 (COM-RIDET ou TAHITI)": string;
    "Branche CODE": string | null;
    Branche: string | null;
    "Référentiel de programmation": string | null;
    "Référentiel de programmation CODE": string;
    "N° DP": string | null;
    "N° poste DP": string | null;
    Société: string | null;
    "Exercice comptable": string | null;
    "Fournisseur payé (DP)": string | null;
    "Désignation de la structure": string | null;
    "Centre financier": string | null;
    "Centre financier CODE": string;
    "Domaine fonctionnel": string | null;
    "Domaine fonctionnel CODE": string;
    "Montant payé": number | null;
    // Excel number
    "Date de dernière opération sur la DP": number | null | string;
}

export interface ChorusDto {
    "N° EJ": string;
    // @TODO: check if it is a number after parse
    "N° poste EJ": number;
    "Code taxe 1": string;
    "No TVA 3 (COM-RIDET ou TAHITI)": string;
    "Branche CODE": string;
    Branche: string;
    "Référentiel de programmation": string;
    "Référentiel de programmation CODE": string;
    "N° DP": string;
    // @TODO: check if it is a number after parse
    "N° poste DP": number;
    Société: string;
    "Exercice comptable": number;
    "Fournisseur payé (DP)": string;
    "Désignation de la structure": string;
    "Centre financier": string;
    "Centre financier CODE": string;
    "Domaine fonctionnel": string;
    "Domaine fonctionnel CODE": string;
    "Montant payé": number;
    // Historicaly the date could be represented as a XLSX number or a string
    "Date de dernière opération sur la DP": Date;
}

export type ChorusFseDto = Omit<ChorusDto, "N° poste EJ" | "N° EJ"> & { "N° poste EJ": "#"; "N° EJ": "#" };

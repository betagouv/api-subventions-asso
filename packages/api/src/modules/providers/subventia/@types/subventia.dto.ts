import { SiretDto } from "dto";

export default interface SubventiaDto {
    [key: string]: unknown;

    "Financeur Principal": string;
    "Référence administrative - Demande": string;
    annee_demande: string;
    "SIRET - Demandeur": SiretDto;
    "Date - Décision": string;
    "Montant voté TTC - Décision": number;
    "Montant Ttc": number;
    "Dispositif - Dossier de financement": string;
    "Thematique Title": string;
    "Statut - Dossier de financement": string;
}

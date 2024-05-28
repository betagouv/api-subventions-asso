import { ApplicationStatus, Siret } from "dto";

export default interface SubventiaDto {
    "Financeur Principal": string;
    "Référence administrative - Demande": string;
    anne_demande: number;
    "SIRET - Demandeur": Siret;
    "Date - Décision": string;
    "Montant voté TTC - Décision": number;
    "Montant Ttc": number;
    "Dispositif - Dossier de financement": string;
    "Thematique Title": string;
    "Statut - Dossier de financement": ApplicationStatus;
}

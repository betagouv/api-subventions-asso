import { Siret } from "../shared/Siret";
import { ApplicationStatus } from "../search/DemandeSubvention";

export interface ApplicationDto {
    exercice: number;
    siret: Siret;
    service_instructeur: string;
    dispositif: string;
    montant_accorde: number | null;
    montant_demande?: number; // only optional param because caisse des depots is weird
    statut: ApplicationStatus;
    objet: string;
}

export interface PaymentDto {
    montant_verse: number;
    date_debut: Date;
    bop: string;
}

export type FullGrantDto = PaymentDto & ApplicationDto;

export type GrantDto = PaymentDto | ApplicationDto | FullGrantDto;

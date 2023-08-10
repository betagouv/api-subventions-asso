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

export type PublishableApplicationDto = Omit<ApplicationDto, "montant_demande">;

export interface PaymentDto {
    exercice: number;
    montant_verse: number;
    date_debut: Date;
    bop: string;
}

export type PublishablePaymentDto = PaymentDto; // already ready to manage not publishable data

export type FullGrantDto = PaymentDto & ApplicationDto;

export type PublishableFullGrantDto = PublishablePaymentDto & PublishableApplicationDto;

export type GrantDto = PaymentDto | ApplicationDto | FullGrantDto;

export type PublishableGrantDto = PublishableFullGrantDto | PublishablePaymentDto | PublishableApplicationDto;

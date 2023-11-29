import { Siret } from "../shared/Siret";
import { ApplicationStatus } from "../search/DemandeSubvention";

export interface ApplicationDto {
    /**
     * année budgétaire de la demande de subvention
     */
    exercice: number;
    /**
     * SIRET de l'établissement qui a fait la demande
     */
    siret: Siret;
    /**
     * nom du service qui a instruit la demande de subvention
     */
    service_instructeur: string;
    /**
     * nom du dispositif de financement auprès duquel est fait la demande de subvention
     */
    dispositif: string;
    /**
     * montant accordé en euros, peut-être null si la subvention n'est pas accordée
     */
    montant_accorde: number | null;
    /**
     * montant demandé en euros par l'établissement dans son dossier de demande de subvention
     */
    montant_demande?: number; // only optional param because caisse des depots is weird
    /**
     * Statut de la demande de subvention, prend l'une des valeurs suivantes : Accordé, En instruction, Inéligible, Refusé.
     */
    statut: ApplicationStatus;
    /**
     * Intitulé des actions qui font l'objet de la demande de subvention
     */
    objet: string;
}

export type PublishableApplicationDto = Omit<ApplicationDto, "montant_demande">;

export interface PaymentDto {
    /**
     * année du versement lié à la subvention
     */
    exercice: number;
    /**
     * montant en euros versé à l'association
     */
    montant_verse: number;
    /**
     * date du premier versement de la subvention
     */
    date_debut: Date;
    /**
     * code du domaine fonctionnel, budget opérationnel de l'état
     */
    bop: string;
}

export type PublishablePaymentDto = PaymentDto; // already ready to manage not publishable data

export type FullGrantDto = PaymentDto & ApplicationDto;

export type PublishableFullGrantDto = PublishablePaymentDto & PublishableApplicationDto;

export type GrantDto = PaymentDto | ApplicationDto | FullGrantDto;

export type PublishableGrantDto = PublishableFullGrantDto | PublishablePaymentDto | PublishableApplicationDto;

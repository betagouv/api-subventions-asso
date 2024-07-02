import { Siret } from "../shared/Siret";
import { ApplicationStatus } from "../search/DemandeSubvention";

export interface CommonApplicationDto {
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
/**
 * Flat format for payments
 * Merge all payments granted for an exercise
 */
export interface CommonPaymentDto {
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
export type CommonFullGrantDto = CommonPaymentDto & CommonApplicationDto;
export type CommonGrantDto = CommonPaymentDto | CommonApplicationDto | CommonFullGrantDto;

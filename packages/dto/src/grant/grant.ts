import { DemandeSubvention } from "../demandeSubvention";
import { Payment } from "../payments";
import { CommonApplicationDto, CommonPaymentDto } from "./common";

export type PublishableApplicationDto = Omit<CommonApplicationDto, "montant_demande">;

export type PublishablePaymentDto = CommonPaymentDto; // already ready to manage not publishable data

export type PublishableFullGrantDto = PublishablePaymentDto & PublishableApplicationDto;

export type PublishableGrantDto = PublishableFullGrantDto | PublishablePaymentDto | PublishableApplicationDto;

/** Subvention agrégée : demande et versements associés (format legacy) */
export type Grant = {
    /** Demande de subvention associée. Null si versements sans demande connue. */
    application: DemandeSubvention | null;
    /** Versements liés à cette demande */
    payments: Payment[];
};

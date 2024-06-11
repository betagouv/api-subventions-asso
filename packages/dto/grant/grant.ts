import { DemandeSubvention } from "../search";
import { Payment } from "../payments/Payment";
import { CommonApplicationDto, CommonPaymentDto } from "./common";

export type PublishableApplicationDto = Omit<CommonApplicationDto, "montant_demande">;

export type PublishablePaymentDto = CommonPaymentDto; // already ready to manage not publishable data

export type PublishableFullGrantDto = PublishablePaymentDto & PublishableApplicationDto;

export type PublishableGrantDto = PublishableFullGrantDto | PublishablePaymentDto | PublishableApplicationDto;

// TODO: rename DemandeSubvention to Application ?
// TODO: use CommonApplication and extends it for each Provider instead of using DemandeSubvention ?
export type Grant = { application: DemandeSubvention; payments: Payment[] };

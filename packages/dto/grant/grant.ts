import { CommonApplicationDto, CommonPaymentDto } from "./common";

export type PublishableApplicationDto = Omit<CommonApplicationDto, "montant_demande">;

export type PublishablePaymentDto = CommonPaymentDto; // already ready to manage not publishable data

export type PublishableFullGrantDto = PublishablePaymentDto & PublishableApplicationDto;

export type PublishableGrantDto = PublishableFullGrantDto | PublishablePaymentDto | PublishableApplicationDto;

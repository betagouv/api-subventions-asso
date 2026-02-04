import { ApplicationFlatDto, PaymentFlatDto } from "dto";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";

export type RawGrant<T> = {
    provider: string;
    type: "application" | "payment";
    data: T;
    joinKey?: string;
};

export interface RawApplication extends RawGrant<ApplicationFlatEntity> {
    type: "application";
}

export interface RawPayment extends RawGrant<PaymentFlatEntity> {
    type: "payment";
}

export type AnyRawGrant = RawApplication | RawPayment;

export type JoinedRawGrant = {
    payments?: RawPayment[];
    application?: RawApplication | null;
};

// @TODO: DTO should be defined in dto package but I choose to put this here to avoid duplicate RawGrant in DTO
// This should be refactored and remove : "raw grant" terms and domains does not need to exists anymore as it only use flats collections now
export type JoinedRawGrantDto = {
    payments: RawGrant<PaymentFlatDto>[];
    application: RawGrant<ApplicationFlatDto> | null;
};

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

type DefaultObject = Record<string, unknown>;

// TODO: rename RawGrant to RawData ?

export type RawGrant<T = DefaultObject> = {
    provider: string;
    // TODO: rename fullGrant to grant if we rename RawGrant to RawData ?
    type: "application" | "fullGrant" | "payment";

    data: T;
    joinKey?: string;
};

export interface RawApplication<T = DefaultObject> extends RawGrant<T> {
    type: "application";
}

export interface RawPayment<T = DefaultObject> extends RawGrant<T> {
    type: "payment";
}

export type FullGrantData<T1 = DefaultObject, T2 = DefaultObject> = {
    application: T1;
    payments: T2[];
};

export interface RawFullGrant<T = FullGrantData> extends RawGrant<T> {
    type: "fullGrant";
}

export type AnyRawGrant = RawFullGrant | RawApplication | RawPayment;

export type JoinedRawGrant = {
    fullGrants?: RawFullGrant[];
    payments?: RawPayment[];
    applications?: RawApplication[];
};

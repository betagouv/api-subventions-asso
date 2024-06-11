// TODO: rename RawGrant to RawData ?
export type RawGrant<T = Record<string, any>> = {
    provider: string;
    // TODO: rename fullGrant to grant if we rename RawGrant to RawData ?
    type: "application" | "fullGrant" | "payment";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- neither never nor unknown works
    data: T;
    joinKey?: string;
};

export interface RawApplication<T> extends RawGrant<T> {
    type: "application";
}

export interface RawPayment<T> extends RawGrant<T> {
    type: "payment";
}

export interface RawFullGrant<T> extends RawGrant<T> {
    type: "fullGrant";
}

export type JoinedRawGrant = {
    fullGrants?: RawGrant<any>[];
    payments?: RawPayment<any>[];
    applications?: RawApplication<any>[];
};

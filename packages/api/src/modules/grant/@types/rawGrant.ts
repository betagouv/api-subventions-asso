type DefaultObject = Record<string, any>;

// TODO: rename RawGrant to RawData ?
/** Giulia says: est-ce que ça pourrait valoir le coup de definir de quoi on parle
  quand on définit des types ou des interfaces comme ici ? 
  RawGrant ça represent quoi ? fullGrant quoi ? 
  J'ai l'impression que ça aiderait à y voir mieux dans la nomenclature chioisie 
 et chaque dev serait un peu plus independent. Qu'en pensez vous ? 
*/
export type RawGrant<T = DefaultObject> = {
    provider: string;
    // TODO: rename fullGrant to grant if we rename RawGrant to RawData ?
    type: "application" | "fullGrant" | "payment";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- neither never nor unknown works
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

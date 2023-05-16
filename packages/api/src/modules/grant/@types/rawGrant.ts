export type RawGrant = {
    provider: string;
    type: "application" | "fullGrant" | "payment";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- neither never nor unknown works
    data: Record<string, any>;
    joinKey?: string;
};

export type JoinedRawGrant = {
    fullGrant?: RawGrant;
    payments?: RawGrant[];
    application?: RawGrant;
};

export const TerritorialScope = {
    REGIONAL: "REGIONAL",
    DEPARTMENTAL: "DEPARTMENTAL",
    INTERCOMMUNAL: "INTERCOMMUNAL",
    COMMUNAL: "COMMUNAL",
    OTHER: "OTHER",
} as const;

export type TerritorialScope = (typeof TerritorialScope)[keyof typeof TerritorialScope];

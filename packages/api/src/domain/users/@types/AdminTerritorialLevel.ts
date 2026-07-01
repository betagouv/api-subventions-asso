// best practice to not use enum and this is the new way
export const AdminTerritorialLevel = {
    REGIONAL: "REGIONAL",
    DEPARTMENTAL: "DEPARTMENTAL",
    INTERREGIONAL: "INTERREGIONAL",
    INTERDEPARTMENTAL: "INTERDEPARTMENTAL",
    OVERSEAS: "OVERSEAS",
} as const;
export type AdminTerritorialLevel = (typeof AdminTerritorialLevel)[keyof typeof AdminTerritorialLevel];

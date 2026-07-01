export const AgentType = {
    OPERATOR: "OPERATOR",
    CENTRAL_ADMIN: "CENTRAL_ADMIN",
    TERRITORIAL_COLLECTIVITY: "TERRITORIAL_COLLECTIVITY",
    DECONCENTRATED_ADMIN: "DECONCENTRATED",
} as const;

export type AgentType = (typeof AgentType)[keyof typeof AgentType];

export const AgentJobType = {
    ADMINISTRATOR: "ADMINISTRATOR",
    EXPERT: "EXPERT",
    SERVICE_HEAD: "SERVICE_HEAD",
    CONTROLLER: "CONTROLLER",
    OTHER: "OTHER",
} as const;

export type AgentJobType = (typeof AgentJobType)[keyof typeof AgentJobType];

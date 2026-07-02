import { AgentJobTypeEnum, AgentTypeEnum, UserDto, UserWithJWTDto } from "dto";

export const USER_DTO_DEFAULT: UserDto = {
    id: "string",
    agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
    jobType: [AgentJobTypeEnum.ADMINISTRATOR],
    email: "john.doe@gouv.fr",
    roles: ["user"],
    active: true,
    signupAt: new Date("2024-01-15"),
    profileToComplete: false,
    nbVisits: 235,
    lastActivityDate: new Date("2025-05-12"),
};

export const USER_DTO_NEW: UserDto = {
    id: "string",
    agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
    jobType: [AgentJobTypeEnum.ADMINISTRATOR],
    email: "john.doe@gouv.fr",
    roles: ["user"],
    active: true,
    signupAt: new Date("2024-01-15"),
    profileToComplete: false,
    nbVisits: 0,
    lastActivityDate: null,
};

export const USER_DTO_SIGNIN: UserDto = {
    id: "string",
    agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
    jobType: [AgentJobTypeEnum.ADMINISTRATOR],
    email: "john.doe@gouv.fr",
    roles: ["user"],
    active: false,
    signupAt: new Date("2024-01-15"),
    profileToComplete: true,
    nbVisits: 0,
    lastActivityDate: null,
};

export const USER_DTO_ADMIN: UserDto = {
    id: "string",
    agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
    jobType: [AgentJobTypeEnum.ADMINISTRATOR],
    email: "john.doe@gouv.fr",
    roles: ["user", "admin"],
    active: true,
    signupAt: new Date("2024-01-15"),
    profileToComplete: false,
    nbVisits: 235,
    lastActivityDate: new Date("2025-05-12"),
};

export const USER_DTO_LOGGED: UserWithJWTDto = {
    id: "string",
    agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
    jobType: [AgentJobTypeEnum.ADMINISTRATOR],
    email: "john.doe@gouv.fr",
    roles: ["user"],
    active: true,
    signupAt: new Date("2024-01-15"),
    profileToComplete: false,
    nbVisits: 235,
    lastActivityDate: new Date("2025-05-12"),
    jwt: {
        token: "string",
        expirateDate: new Date("2025-05-14"),
    },
};

import {
    AdminTerritorialLevel,
    AgentJobTypeEnum,
    AgentTypeEnum,
    RegistrationSrcTypeEnum,
    TerritorialScopeEnum,
} from "../auth";

export default UserDto;

export interface FutureUserDto {
    email: string;
    roles?: string[];
    firstName?: string;
    lastName?: string;
    proConnectId?: string;
}

export interface UserDto extends FutureUserDto, Omit<UserActivationInfoDto, "password"> {
    id: string;
    roles: string[];
    active: boolean;
    signupAt: Date;
    profileToComplete: boolean;
    disable?: boolean;
    lastActivityDate: Date | null;
    proConnectId?: string;
    nbVisits: number;
}

export interface ActivateUserBody {
    token: string;
    data: UserActivationInfoDto;
}

export interface UserActivationInfoDto {
    password: string;
    agentType?: AgentTypeEnum;
    jobType?: AgentJobTypeEnum[];
    service?: string;
    phoneNumber?: string;
    structure?: string;
    // TODO: verify from GEO API
    region?: string;
    decentralizedLevel?: AdminTerritorialLevel;
    // TODO: verify from GEO API
    decentralizedTerritory?: string;
    territorialScope?: TerritorialScopeEnum;
    registrationSrc?: RegistrationSrcTypeEnum[];
    registrationSrcEmail?: string;
    registrationSrcDetails?: string;
}

export interface UpdatableUser {
    firstName?: string;
    lastName?: string;
    agentType: AgentTypeEnum;
    jobType: AgentJobTypeEnum[];
    service?: string;
    phoneNumber?: string;
    structure?: string;
    // TODO: verify from GEO API
    region?: string;
    decentralizedLevel?: AdminTerritorialLevel;
    // TODO: verify from GEO API
    decentralizedTerritory?: string;
    territorialScope?: TerritorialScopeEnum;
    registrationSrc?: RegistrationSrcTypeEnum[];
    registrationSrcEmail?: string;
    registrationSrcDetails?: string;
    //To user from pro connect
    profileToComplete?: boolean;
}

export interface UserWithJWTDto extends UserDto {
    jwt: { token: string; expirateDate: Date };
}

export interface UserResetDto {
    resetToken?: string;
    resetTokenDate?: Date;
    resetUrl?: string;
}

export type UserWithResetTokenDto = UserDto & UserResetDto & Partial<UserDto>;

import { ObjectId } from "mongodb";
import { AdminTerritorialLevel, AgentJobTypeEnum, AgentTypeEnum, TerritorialScopeEnum } from "../auth";

export default UserDto;

export interface FutureUserDto {
    email: string;
    roles?: string[];
    firstName?: string;
    lastName?: string;
}

export interface UserDto extends FutureUserDto, Omit<UserActivationInfoDto, "password"> {
    _id: ObjectId;
    roles: string[];
    active: boolean;
    signupAt: Date;
    profileToComplete: boolean;
    disable?: boolean;
}

export interface UserActivationInfoDto {
    password: string;
    agentType: AgentTypeEnum;
    jobType: AgentJobTypeEnum[];
    service?: string;
    phoneNumber?: string;
    structure?: string;
    decentralizedLevel?: AdminTerritorialLevel;
    // TODO: verify from GEO API
    decentralizedTerritory?: string;
    territorialScope?: TerritorialScopeEnum;
}

export interface UpdatableUser {
    firstName?: string;
    lastName?: string;
    agentType: AgentTypeEnum;
    jobType: AgentJobTypeEnum[];
    service?: string;
    phoneNumber?: string;
    structure?: string;
    decentralizedLevel?: AdminTerritorialLevel;
    // TODO: verify from GEO API
    decentralizedTerritory?: string;
    territorialScope?: TerritorialScopeEnum;
}

export interface UserWithJWTDto extends UserDto {
    jwt: { token: string; expirateDate: Date };
}

export interface UserStatsDto {
    stats: {
        searchCount: number;
        lastSearchDate: Date | null;
    };
}

export interface UserResetDto {
    resetToken?: string;
    resetTokenDate?: Date;
}

export type UserWithStatsDto = UserDto & UserStatsDto;

export type UserWithResetTokenDto = UserDto & UserResetDto & Partial<UserStatsDto>;

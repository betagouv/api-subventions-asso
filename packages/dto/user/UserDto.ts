import { ObjectId } from "mongodb";
import { AdminTerritorialLevel, AgentJobTypeEnum, AgentTypeEnum, FromTypeEnum, TerritorialScopeEnum } from "../auth";

export default UserDto;

export interface FutureUserDto {
    email: string;
    roles?: string[];
    firstName?: string;
    lastName?: string;
    agentConnectId?: string;
}

export interface UserDto extends FutureUserDto, Omit<UserActivationInfoDto, "password"> {
    _id: ObjectId;
    roles: string[];
    active: boolean;
    signupAt: Date;
    profileToComplete: boolean;
    disable?: boolean;
    lastActivityDate: Date | null;
    agentConnectId?: string;
    nbVisits: number;
}

export interface UserActivationInfoDto {
    password: string;
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
    from?: FromTypeEnum;
    fromMail?: string;
    fromOther?: string;
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
    from?: FromTypeEnum;
    fromMail?: string;
    fromOther?: string;
}

export interface UserWithJWTDto extends UserDto {
    jwt: { token: string; expirateDate: Date };
}

export interface UserResetDto {
    resetToken?: string;
    resetTokenDate?: Date;
}

export type UserWithResetTokenDto = UserDto & UserResetDto & Partial<UserDto>;

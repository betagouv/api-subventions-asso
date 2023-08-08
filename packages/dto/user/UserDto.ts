import { ObjectId } from "mongodb";

export default UserDto;

export interface FutureUserDto {
    email: string;
    roles?: string[];
    firstName?: string;
    lastName?: string;
}

export interface UserDto extends FutureUserDto {
    _id: ObjectId;
    roles: string[];
    active: boolean;
    signupAt: Date;
    profileToComplete: boolean;
    disable?: boolean;
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

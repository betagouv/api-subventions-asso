import { ObjectId } from "mongodb";

export default UserDto;

export interface UserDto {
    _id: ObjectId;
    email: string;
    roles: string[];
    active: boolean;
    signupAt: Date;
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

export interface GetUserSuccessResponseDto {
    user: UserDto;
}

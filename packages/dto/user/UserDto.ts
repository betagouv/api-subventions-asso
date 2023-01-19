import { ObjectId } from "mongodb";

export default interface UserDto {
    _id: ObjectId;
    email: string;
    roles: string[];
    active: boolean;
    signupAt: Date;
    stats: {
        searchCount: number;
        lastSearchDate: Date | null;
    };
}

export interface UserWithJWTDto extends UserDto {
    jwt: { token: string; expirateDate: Date };
}

export interface UserWithResetTokenDto {
    _id: string;
    email: string;
    roles: string[];
    active: boolean;
    signupAt: Date;
    stats: {
        searchCount: number;
        lastSearchDate: Date | null;
    };
    resetToken?: string;
    resetTokenDate?: Date;
}
export interface GetUserSuccessResponseDto {
    user: UserDto;
}

import { UserDto } from "dto";

export default interface UserDbo extends UserDto {
    jwt: JWT | null;
    hashPassword?: string;
}

export interface JWT {
    token: string;
    expirateDate: Date;
}

export type UserNotPersisted = Omit<UserDbo, "_id">;

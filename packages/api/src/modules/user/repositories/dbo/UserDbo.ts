import { UserDto } from "dto";

export default interface UserDbo extends UserDto {
    jwt: JWT | null;
    hashPassword: string | null;
}

export interface JWT {
    token: string;
    expirateDate: Date;
}

export type UserNotPersisted = Omit<UserDbo, "_id">;

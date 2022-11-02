import { ObjectId } from "mongodb";

export default interface UserDbo {
    _id: ObjectId,
    jwt: JWT,
    hashPassword: string,
    email: string,
    roles: string[],
    active: boolean,
    signupAt: Date,
    stats: UserStats
}

export interface JWT {
    token: string,
    expirateDate: Date
}

export interface UserStats {
    searchCount: number,
    lastSearchDate: Date | null,
}
import { ObjectId } from "mongodb";

export default interface UserDbo {
    _id: ObjectId;
    jwt: JWT | null;
    hashPassword: string;
    email: string;
    roles: string[];
    active: boolean;
    signupAt: Date;
    disable?: boolean;
}

export interface JWT {
    token: string;
    expirateDate: Date;
}

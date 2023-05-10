import { ObjectId } from "mongodb";
import AssociationVisitEntity from "../../../stats/entities/AssociationVisitEntity";

export default interface UserDbo {
    _id: ObjectId;
    jwt: JWT | null;
    hashPassword: string;
    email: string;
    roles: string[];
    active: boolean;
    signupAt: Date;
}

export interface JWT {
    token: string;
    expirateDate: Date;
}

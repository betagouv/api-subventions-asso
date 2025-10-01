import { ObjectId } from "mongodb";

export default interface DepositScdlLogDbo {
    _id: ObjectId;
    userId: string;
    updateDate: Date;
    step: number;
    overwriteAlert: boolean;
    permissionAlert: boolean;
    grantOrgSiret?: string;
}

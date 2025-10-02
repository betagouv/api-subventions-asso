import { ObjectId } from "mongodb";

export default interface DepositScdlLogDbo {
    _id?: ObjectId;
    updateDate: Date;
    userId: string;
    step: number;
    overwriteAlert?: boolean;
    permissionAlert?: boolean;
    grantOrgSiret?: string;
}

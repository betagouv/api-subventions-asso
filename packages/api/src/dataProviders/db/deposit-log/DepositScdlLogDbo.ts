import { ObjectId } from "mongodb";
import UploadedFileInfosDbo from "./UploadedFileInfosDbo";

export default interface DepositScdlLogDbo {
    _id?: ObjectId;
    updateDate: Date;
    userId: string;
    step: number;
    permissionAlert?: boolean;
    allocatorSiret?: string;
    uploadedFileInfos?: UploadedFileInfosDbo;
}

import { ObjectId } from "mongodb";
import UploadedFileInfosDbo from "./UploadedFileInfosDbo";

export default interface DepositScdlLogDbo {
    _id?: ObjectId;
    updateDate: Date;
    userId: string;
    step: number;
    overwriteAlert?: boolean;
    permissionAlert?: boolean;
    allocatorSiret?: string;
    uploadFileInfos?: UploadedFileInfosDbo;
}

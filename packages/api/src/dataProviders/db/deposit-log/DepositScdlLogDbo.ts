import { ObjectId } from "mongodb";

interface UploadedFileInfosDbo {
    fileName?: string;
    uploadDate?: Date;
    allocatorSiret?: string;
    errors?: {
        [key: string]: unknown;
        colonne: string;
        valeur: unknown;
        message: string;
        bloquant: "oui" | "non";
        doublon: "oui" | "non";
    }[];
    beginPaymentDate?: Date;
    endPaymentDate?: Date;
    parseableLines?: number;
    existingLinesInDbOnSamePeriod?: number;
}

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

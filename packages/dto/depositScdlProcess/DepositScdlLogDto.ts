import { UploadedFileInfosDto } from "./UploadedFileInfosDto";

export interface DepositScdlLogDto {
    overwriteAlert?: boolean;
    allocatorSiret?: string;
    permissionAlert?: boolean;
    uploadedFileInfos?: UploadedFileInfosDto;
}

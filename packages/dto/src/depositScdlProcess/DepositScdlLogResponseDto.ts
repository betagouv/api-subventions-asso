import { DepositScdlLogDto } from "./DepositScdlLogDto";
import { UploadedFileInfosDto } from "./UploadedFileInfosDto";

export interface DepositScdlLogResponseDto extends DepositScdlLogDto {
    step: number;
    uploadedFileInfos?: UploadedFileInfosDto;
}

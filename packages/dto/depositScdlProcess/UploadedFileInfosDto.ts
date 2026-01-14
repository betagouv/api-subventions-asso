import { ScdlErrorStatsDto } from "./ScdlErrorStatsDto";
import { HeaderValidationResultDto } from "./HeaderValidationResultDto";

export interface UploadedFileInfosDto {
    fileName: string;
    uploadDate: Date;
    allocatorsSiret: string[];
    grantCoverageYears: number[];
    parseableLines: number;
    totalLines: number;
    headerValidationResult: HeaderValidationResultDto;
    existingLinesInDbOnSamePeriod: number;
    errorStats: ScdlErrorStatsDto;
    sheetName?: string;
}

import { ScdlErrorStatsDto } from "./ScdlErrorStatsDto";

export interface UploadedFileInfosDto {
    fileName: string;
    uploadDate: Date;
    allocatorsSiret: string[];
    grantCoverageYears: number[];
    parseableLines: number;
    totalLines: number;
    existingLinesInDbOnSamePeriod: number;
    errorStats: ScdlErrorStatsDto;
    sheetName?: string;
}

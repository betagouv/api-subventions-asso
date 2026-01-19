import { ScdlErrorStatsDto } from "./ScdlErrorStatsDto";
import { MissingHeadersDto } from "./MissingHeadersDto";

export interface UploadedFileInfosDto {
    fileName: string;
    uploadDate: Date;
    allocatorsSiret: string[];
    grantCoverageYears: number[];
    parseableLines: number;
    totalLines: number;
    missingHeaders: MissingHeadersDto;
    existingLinesInDbOnSamePeriod: number;
    errorStats: ScdlErrorStatsDto;
    sheetName?: string;
}

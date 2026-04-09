import { ScdlErrorStatsDto } from "./ScdlErrorStatsDto";
import { MissingHeadersDto } from "./MissingHeadersDto";
import { LineCountByExerciceDto } from "./LineCountByExerciceDto";

export interface UploadedFileInfosDto {
    fileName: string;
    uploadDate: Date;
    allocatorsSiret: string[];
    grantCoverageYears: number[];
    parseableLines: number;
    totalLines: number;
    lineCountsByExercice: LineCountByExerciceDto[];
    missingHeaders: MissingHeadersDto;
    existingLinesInDbOnSamePeriod: number;
    errorStats: ScdlErrorStatsDto;
    sheetName?: string;
    processedExercices?: number[];
}

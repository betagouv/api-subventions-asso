import { MixedParsedErrorDto } from "./MixedParsedErrorDto";

export interface UploadedFileInfosDto {
    fileName: string;
    uploadDate: Date;
    allocatorsSiret: string[];
    grantCoverageYears: number[];
    parseableLines: number;
    totalLines: number;
    existingLinesInDbOnSamePeriod?: number;
    errors?: MixedParsedErrorDto[];
}

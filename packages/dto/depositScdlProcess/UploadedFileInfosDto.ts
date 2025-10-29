import { MixedParsedErrorDto } from "./MixedParsedErrorDto";

export interface UploadedFileInfosDto {
    fileName: string;
    uploadDate: Date;
    allocatorSiret: string[];
    errors?: MixedParsedErrorDto[];
    beginPaymentDate?: Date;
    endPaymentDate?: Date;
    parseableLines?: number;
    existingLinesInDbOnSamePeriod?: number;
}

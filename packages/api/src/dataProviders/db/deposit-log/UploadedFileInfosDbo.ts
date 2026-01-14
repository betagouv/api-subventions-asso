export default interface UploadedFileInfosDbo {
    fileName: string;
    uploadDate: Date;
    allocatorsSiret: string[];
    grantCoverageYears: number[];
    parseableLines: number;
    totalLines: number;
    headerValidationResult: {
        missingMandatory: string[];
        missingOptional: string[];
    };
    existingLinesInDbOnSamePeriod: number;
    errorStats: {
        count: number;
        errorSample: {
            [key: string]: unknown;
            colonne: string;
            valeur: unknown;
            message: string;
            bloquant: "oui" | "non";
            doublon: "oui" | "non";
        }[];
    };
    sheetName?: string;
}

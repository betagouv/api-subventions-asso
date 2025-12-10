export default interface UploadedFileInfosDbo {
    fileName: string;
    uploadDate: Date;
    allocatorsSiret: string[];
    grantCoverageYears: number[];
    parseableLines: number;
    totalLines: number;
    existingLinesInDbOnSamePeriod: number;
    errors: {
        [key: string]: unknown;
        colonne: string;
        valeur: unknown;
        message: string;
        bloquant: "oui" | "non";
        doublon: "oui" | "non";
    }[];
    sheetName?: string;
}

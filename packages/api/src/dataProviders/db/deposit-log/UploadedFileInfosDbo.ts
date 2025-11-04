export default interface UploadedFileInfosDbo {
    fileName: string;
    uploadDate: Date;
    allocatorsSiret: string[];
    errors?: {
        [key: string]: unknown;
        colonne: string;
        valeur: unknown;
        message: string;
        bloquant: "oui" | "non";
        doublon: "oui" | "non";
    }[];
    beginPaymentDate?: Date;
    endPaymentDate?: Date;
    parseableLines?: number;
    existingLinesInDbOnSamePeriod?: number;
}

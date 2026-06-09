import { FileImportResult } from "./FileImportResult";

export interface FileImportLog extends FileImportResult {
    fileName: string;
    durationMs: number;
    fileCount?: number;
    exerciseYear?: number;
}

import { ImportReport } from "../../../@types/ImportReport";

export interface NotifyImportFailureContext {
    providerSiret?: string;
    exportDate?: Date;
    fileName?: string;
    durationMs?: number;
    exerciseYear?: number;
    fileCount?: number;
    report?: Partial<ImportReport>;
}

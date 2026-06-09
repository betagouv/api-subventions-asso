import path from "path";
import notifyService from "../../modules/notify/notify.service";
import { NotificationType } from "../../modules/notify/@types/NotificationType";
import { FileImportLog } from "../../@types/FileImportLog";
import { FileImportResult } from "../../@types/FileImportResult";

export interface NotifyImportSuccessOptions {
    providerSiret?: string;
    exportDate?: Date;
    fileCount: number;
    exerciseYear?: number;
}

export interface NotifyImportFailureOptions {
    providerSiret?: string;
    exportDate?: Date;
    fileName?: string;
    durationMs?: number;
    exerciseYear?: number;
    fileCount?: number;
    result?: Partial<FileImportResult>;
}

export async function notifyImportSuccess(
    providerName: string,
    file: string,
    result: FileImportResult,
    durationMs: number,
    options: NotifyImportSuccessOptions,
): Promise<void> {
    const details: FileImportLog = {
        fileName: path.basename(file),
        parsedCount: result.parsedCount,
        importedCount: result.importedCount,
        errorCount: result.errorCount,
        durationMs,
        fileCount: options.fileCount,
        exerciseYear: options.exerciseYear,
    };
    return notifyService.notify(NotificationType.DATA_IMPORT_SUCCESS, {
        providerName,
        providerSiret: options.providerSiret,
        exportDate: options.exportDate,
        details,
    });
}

export async function notifyImportFailure(
    providerName: string,
    error: Error | string,
    options: NotifyImportFailureOptions,
): Promise<void> {
    const rawDetails = {
        fileName: options.fileName,
        durationMs: options.durationMs,
        exerciseYear: options.exerciseYear,
        fileCount: options.fileCount,
        parsedCount: options.result?.parsedCount,
        importedCount: options.result?.importedCount,
        errorCount: options.result?.errorCount,
    };
    const details = Object.fromEntries(
        Object.entries(rawDetails).filter(([, v]) => v !== undefined),
    ) as Partial<FileImportLog>;
    return notifyService.notify(NotificationType.DATA_IMPORT_FAILURE, {
        providerName,
        providerSiret: options.providerSiret,
        exportDate: options.exportDate,
        error: error instanceof Error ? error.message : error,
        details: Object.keys(details).length ? details : undefined,
    });
}

import { NotifyImportFailureContext } from "../../../@types/NotifyImportFailureContext";
import { NotificationType } from "../@types/NotificationType";
import notifyService, { NotifyService } from "../notify.service";

export interface ImportFailurePayload {
    providerName: string;
    error: Error | string;
    context: NotifyImportFailureContext;
}

export default class NotifyImportFailureUseCase {
    constructor(private notifier: NotifyService) {}

    async execute(payload: ImportFailurePayload): Promise<void> {
        const { providerName, context, error } = payload;

        const details = {
            fileName: context.fileName,
            durationMs: context.durationMs,
            ...(context.exerciseYear !== undefined ? { exerciseYear: context.exerciseYear } : {}),
            ...(context.fileCount !== undefined ? { fileCount: context.fileCount } : {}),
            ...(context.report
                ? {
                      parsedCount: context.report.parsedCount,
                      importedCount: context.report.importedCount,
                      errorCount: context.report.errorCount,
                  }
                : {}),
        };

        await this.notifier.notify(NotificationType.DATA_IMPORT_FAILURE, {
            providerName,
            providerSiret: context.providerSiret,
            exportDate: context.exportDate,
            error: error instanceof Error ? error.message : error,
            details,
        });
    }
}

const notifyImportFailureUseCase = new NotifyImportFailureUseCase(notifyService);

export { notifyImportFailureUseCase };

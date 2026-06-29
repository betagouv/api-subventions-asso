import { NotifyImportFailureContext } from "../../../@types/NotifyImportFailureContext";
import { NotificationType } from "../@types/NotificationType";
import notifyService, { NotifyService } from "../notify.service";

export default class NotifyImportFailureUseCase {
    constructor(private notifier: NotifyService) {}

    async execute(providerName: string, error: Error | string, context: NotifyImportFailureContext): Promise<void> {
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

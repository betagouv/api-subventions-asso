import { ImportNotificationDetails } from "../../../@types/ImportNotificationDetails";
import { NotificationType } from "../@types/NotificationType";
import { NotifyImportFailureContext } from "../@types/NotifyImportFailureContext";
import notifyService, { NotifyService } from "../notify.service";

export default class NotifyImportFailureUseCase {
    constructor(private notifier: NotifyService) {}

    async execute(providerName: string, error: Error | string, context: NotifyImportFailureContext): Promise<void> {
        const rawDetails = {
            fileName: context.fileName,
            durationMs: context.durationMs,
            exerciseYear: context.exerciseYear,
            fileCount: context.fileCount,
            parsedCount: context.report?.parsedCount,
            importedCount: context.report?.importedCount,
            errorCount: context.report?.errorCount,
        };

        const details = Object.fromEntries(
            Object.entries(rawDetails).filter(([, value]) => value !== undefined),
        ) as Partial<ImportNotificationDetails>;

        await this.notifier.notify(NotificationType.DATA_IMPORT_FAILURE, {
            providerName,
            providerSiret: context.providerSiret,
            exportDate: context.exportDate,
            error: error instanceof Error ? error.message : error,
            details: Object.keys(details).length ? details : undefined,
        });
    }
}

const notifyImportFailureUseCase = new NotifyImportFailureUseCase(notifyService);

export { notifyImportFailureUseCase };

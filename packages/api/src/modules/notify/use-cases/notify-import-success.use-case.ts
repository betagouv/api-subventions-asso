import path from "path";
import { ImportNotificationDetails } from "../../../@types/ImportNotificationDetails";
import { ImportReport } from "../../../@types/ImportReport";
import { NotifyImportSuccessContext } from "../../../@types/NotifyImportSuccessContext";
import { NotificationType } from "../@types/NotificationType";
import notifyService, { NotifyService } from "../notify.service";

export interface ImportSuccessPayload {
    providerName: string;
    file: string;
    report: ImportReport;
    context: NotifyImportSuccessContext;
}

export default class NotifyImportSuccessUseCase {
    constructor(private notifier: NotifyService) {}

    async execute(payload: ImportSuccessPayload): Promise<void> {
        const { providerName, file, report, context } = payload;

        const details: ImportNotificationDetails = {
            fileName: path.basename(file),
            parsedCount: report.parsedCount,
            importedCount: report.importedCount,
            errorCount: report.errorCount,
            durationMs: context.durationMs,
            fileCount: context.fileCount,
            exerciseYear: context.exerciseYear,
        };

        await this.notifier.notify(NotificationType.DATA_IMPORT_SUCCESS, {
            providerName,
            providerSiret: context.providerSiret,
            exportDate: context.exportDate,
            details,
        });
    }
}

const notifyImportSuccessUseCase = new NotifyImportSuccessUseCase(notifyService);

export { notifyImportSuccessUseCase };

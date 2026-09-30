import path from "path";
import { ImportNotificationDetails } from "../../../@types/ImportNotificationDetails";
import { ImportReport } from "../../../@types/ImportReport";
import { NotifyImportSuccessContext } from "../../../@types/NotifyImportSuccessContext";
import { NotificationType } from "../@types/NotificationType";
import notifyService, { NotifyService } from "../notify.service";
import { NotificationDataTypes } from "../@types/NotificationDataTypes";

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
        };

        if (context.exerciseYear) details.exerciseYear = context.exerciseYear;

        const notifyData: NotificationDataTypes[NotificationType.DATA_IMPORT_SUCCESS] = {
            providerName,
            exportDate: context.exportDate,
            details,
        };

        if (context.providerSiret) notifyData.providerSiret = context.providerSiret;

        await this.notifier.notify(NotificationType.DATA_IMPORT_SUCCESS, notifyData);
    }
}

const notifyImportSuccessUseCase = new NotifyImportSuccessUseCase(notifyService);

export { notifyImportSuccessUseCase };

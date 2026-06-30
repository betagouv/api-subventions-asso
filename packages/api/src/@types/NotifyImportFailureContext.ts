import { BaseNotifyImport } from "./BaseNotifyImport";
import { ImportReport } from "./ImportReport";

export interface NotifyImportFailureContext extends BaseNotifyImport {
    fileName: string;
    fileCount?: number;
    report?: ImportReport;
}

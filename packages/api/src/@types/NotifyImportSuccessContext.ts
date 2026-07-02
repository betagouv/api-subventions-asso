import { BaseNotifyImport } from "./BaseNotifyImport";

export interface NotifyImportSuccessContext extends BaseNotifyImport {
    fileCount: number;
}

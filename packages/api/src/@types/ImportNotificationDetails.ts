import { ImportReport } from "./ImportReport";

export interface ImportNotificationDetails extends ImportReport {
    fileName: string;
    durationMs: number;
    fileCount?: number;
    exerciseYear?: number;
}

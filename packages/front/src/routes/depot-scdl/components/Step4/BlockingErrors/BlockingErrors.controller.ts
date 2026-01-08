import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";

export default class BlockingErrorsController {
    public isErrorReportTruncated: boolean = false;
    public errorCount: number;

    constructor() {
        const depositLog = depositLogStore.value!;
        const errorStats = depositLog.uploadedFileInfos!.errorStats;
        this.errorCount = errorStats.count;
        if (errorStats.count > errorStats.errors.length) this.isErrorReportTruncated = true;
    }

    async downloadErrorFile() {
        await depositLogService.downloadErrorFile(depositLogStore.value!.uploadedFileInfos!);
    }
}

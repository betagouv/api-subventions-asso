import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";

export default class BlockingErrorsController {
    public isErrorReportTruncated: boolean = false;
    public errorCount: number;
    public allocatorSiret: string;
    public allocatorName?: string;

    constructor() {
        const depositLog = depositLogStore.value!;
        const errorStats = depositLog.uploadedFileInfos!.errorStats;
        this.errorCount = errorStats.count;
        if (errorStats.count > errorStats.errorSample.length) this.isErrorReportTruncated = true;
        this.allocatorSiret = depositLog.allocatorSiret!;
        this.allocatorName = depositLog.allocatorName;
    }

    async downloadErrorFile() {
        await depositLogService.downloadErrorFile(depositLogStore.value!.uploadedFileInfos!);
    }
}

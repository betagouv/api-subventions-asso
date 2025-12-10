import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";

export default class ConfirmDataAddController {
    public addedLines: number;
    public existingLinesInDb: number;
    public rangeStartYear: number;
    public rangeEndYear: number;

    constructor() {
        const depositLog = depositLogStore.value!;
        const uploadedFileInfos = depositLog.uploadedFileInfos!;
        this.addedLines = uploadedFileInfos.parseableLines;
        this.existingLinesInDb = uploadedFileInfos.existingLinesInDbOnSamePeriod;
        this.rangeStartYear = Math.min(...uploadedFileInfos.grantCoverageYears);
        this.rangeEndYear = Math.max(...uploadedFileInfos.grantCoverageYears);
    }

    async downloadGrantsCsv() {
        const { csvData, fileName } = await depositLogService.getCsv();
        const blob = new Blob([csvData], { type: "text/csv; charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}

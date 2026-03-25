import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { LineCountByExerciceDto } from "dto/build/src/depositScdlProcess/LineCountByExerciceDto";

export default class ConfirmDataAddController {
    public addedLines: number;
    public existingLinesInDb: number;
    public rangeStartYear: number;
    public rangeEndYear: number;
    public filename: string;
    public allocatorSiret: string;
    public allocatorName?: string;
    public tableContent: LineCountByExerciceDto[] = [];

    constructor() {
        const depositLog = depositLogStore.value!;
        const uploadedFileInfos = depositLog.uploadedFileInfos!;
        this.addedLines = uploadedFileInfos.parseableLines;
        this.existingLinesInDb = uploadedFileInfos.existingLinesInDbOnSamePeriod;
        this.rangeStartYear = Math.min(...uploadedFileInfos.grantCoverageYears);
        this.rangeEndYear = Math.max(...uploadedFileInfos.grantCoverageYears);
        this.filename = uploadedFileInfos.fileName;
        this.allocatorSiret = depositLog.allocatorSiret!;
        this.allocatorName = depositLog.allocatorName;
        this.tableContent = uploadedFileInfos.lineCountsByExercice;
    }

    async downloadGrantsCsv() {
        await depositLogService.downloadGrantsCsv();
    }

    async generateDownloadUrl() {
        await depositLogService.downloadScdlFile(this.filename);
    }
}

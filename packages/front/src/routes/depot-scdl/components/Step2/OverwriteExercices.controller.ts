import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { LineCountByExerciceDto } from "dto/build/src/depositScdlProcess/LineCountByExerciceDto";
import Store from "$lib/core/Store";

export default class OverwriteExercicesController {
    public filename: string;
    public allocatorSiret: string;
    public allocatorName?: string;
    public tableContent: LineCountByExerciceDto[] = [];
    public checkedExercices: Store<number[]> = new Store([]);

    constructor() {
        const depositLog = depositLogStore.value!;
        const uploadedFileInfos = depositLog.uploadedFileInfos!;

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

    toggleOne(exercice: number) {
        const current = this.checkedExercices.value;
        const updatedExercice = current.includes(exercice)
            ? current.filter(item => item !== exercice)
            : [...current, exercice];
        this.checkedExercices.set(updatedExercice);
    }
}

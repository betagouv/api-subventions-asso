import {
    EXCEL_EXT,
    type FileFormat,
    getExcelSheetNames,
    getFileExtension,
    validateFile,
} from "$lib/helpers/fileHelper";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import Store from "$lib/core/Store";
import FileSizeError from "$lib/errors/file-errors/FileSizeError";
import FileFormatError from "$lib/errors/file-errors/FileFormatError";
import FileEncodingError from "$lib/errors/file-errors/FileEncodingError";
import { depositLogStore } from "$lib/store/depositLog.store";
import type { DepositScdlLogDto } from "dto/depositScdlProcess/DepositScdlLogDto";
import { scdlFileStore } from "$lib/store/scdlFile.store";

type EventMap = {
    prevStep: void;
    nextStep: void;
    loading: void;
    endLoading: void;
    error: string;
};

type DispatchFunction = <K extends keyof EventMap>(
    type: K,
    detail?: EventMap[K] extends void ? never : EventMap[K],
) => void;

export default class Step3Controller {
    private selectedFile: File | null = null;
    private MAX_MO_FILE_SIZE = 30;
    private MIN_LOADING_TIME = 2000;
    private readonly dispatch: DispatchFunction;

    constructor(dispatch: DispatchFunction) {
        this.dispatch = dispatch;
    }

    public uploadConfig = {
        label: "Ajouter un fichier",
        hint: "Formats supportés : csv., xls., xlsx <br> Un seul fichier possible.",
        acceptedFormats: ["csv", "xls"] as FileFormat[],
    };

    public noFileOrInvalid: Store<boolean> = new Store(true);
    public excelSheets: Store<string[]> = new Store([]);
    public view: Store<"upload" | "sheetSelector"> = new Store("upload");
    public uploadErrorMessage: Store<string | undefined> = new Store(undefined);
    public uploadError: Store<boolean> = new Store(false);

    async handleFileChange(event: CustomEvent<{ files: FileList | null }>) {
        const files = event.detail.files;
        if (!files || files.length === 0) {
            this.selectedFile = null;
            this.clearUploadError();
            return;
        }

        const file = files[0];
        scdlFileStore.set(file);

        try {
            await validateFile(file, this.uploadConfig.acceptedFormats, this.MAX_MO_FILE_SIZE);
        } catch (error) {
            this.uploadError.set(true);
            this.noFileOrInvalid.set(true);

            if (error instanceof FileSizeError) {
                this.uploadErrorMessage.set(
                    `Le fichier est trop volumineux. Il doit faire moins de ${error.maxSizeMb} Mo.`,
                );
            } else if (error instanceof FileFormatError) {
                this.uploadErrorMessage.set(
                    "Ce format de fichier n'est pas supporté. Veuillez déposer un fichier au format CSV, XLS ou XLSX.",
                );
            } else if (error instanceof FileEncodingError) {
                this.uploadErrorMessage.set(
                    "Veuillez déposer un fichier au format CSV, XLS ou XLSX avec encodage UTF-8 ou Windows-1252.",
                );
            } else {
                console.error("Unexpected validation error:", error);
                this.uploadErrorMessage.set("Une erreur est survenue lors de la validation du fichier.");
            }
            return;
        }

        this.selectedFile = file;
        this.clearUploadError();
    }

    clearUploadError() {
        this.uploadError.set(false);
        this.uploadErrorMessage.set("");
        this.noFileOrInvalid.set(false);
    }

    async handleValidate() {
        const file = this.selectedFile;
        if (!file) {
            return;
        }

        const fileExtension = getFileExtension(file.name);
        if (fileExtension && EXCEL_EXT.includes(fileExtension)) {
            const sheetNames = await getExcelSheetNames(file);
            if (sheetNames.length > 1) {
                this.excelSheets.set(sheetNames);
                this.view.set("sheetSelector");
                return;
            }
        }
        await this.uploadFile();
    }

    async handleSheetSelected(event: CustomEvent<string>) {
        const selectedSheet = event.detail;
        await this.uploadFile(selectedSheet);
    }

    private async uploadFile(selectedSheet?: string) {
        const startTime = Date.now();
        this.dispatch("loading");

        const depositLog: DepositScdlLogDto = {
            permissionAlert: true,
        };

        try {
            const updatedDepositLog = await depositLogService.postScdlFile(
                this.selectedFile!,
                depositLog,
                selectedSheet,
            );
            depositLogStore.set(updatedDepositLog);

            const elapsed = Date.now() - startTime;
            const remainingTime = this.MIN_LOADING_TIME - elapsed;

            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            this.dispatch("nextStep");
        } catch (e) {
            console.error("Erreur lors de l'upload du fichier", e);
            this.dispatch("endLoading");
            // todo : error handling toast
        }
    }

    handleRestartUpload() {
        this.selectedFile = null;
        this.noFileOrInvalid.set(true);
        this.excelSheets.set([]);
        this.view.set("upload");
    }
}

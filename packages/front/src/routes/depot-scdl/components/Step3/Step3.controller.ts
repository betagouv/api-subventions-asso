import {
    CSV_EXT,
    EXCEL_EXT,
    FileErrorCode,
    type FileFormat,
    fileTypeEnum,
    getExcelSheetNames,
    getFileExtension,
    validateFile,
} from "$lib/helpers/fileHelper";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import Store from "$lib/core/Store";

type EventMap = {
    prevStep: void;
    nextStep: void;
    loading: void;
    error: string;
};

type DispatchFunction = <K extends keyof EventMap>(
    type: K,
    detail?: EventMap[K] extends void ? never : EventMap[K],
) => void;

export default class Step3Controller {
    private selectedFile: File | null = null;
    private MAX_MO_FILE_SIZE = 30;
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

        const fileValidationResult = await validateFile(file, this.uploadConfig.acceptedFormats, this.MAX_MO_FILE_SIZE);
        if (!fileValidationResult.valid) {
            this.uploadError.set(true);
            this.noFileOrInvalid.set(true);
            if (fileValidationResult.errorCode === FileErrorCode.FILE_TOO_LARGE) {
                this.uploadErrorMessage.set("Le fichier est trop volumineux. Il doit faire moins de 30 Mo.");
            } else if (fileValidationResult.errorCode === FileErrorCode.INVALID_FORMAT) {
                this.uploadErrorMessage.set(
                    "Ce format de fichier n'est pas supporté. Veuillez déposer un fichier au format CSV, XLS ou XLSX.",
                );
            } else if (fileValidationResult.errorCode === FileErrorCode.INVALID_ENCODING) {
                this.uploadErrorMessage.set(
                    "Veuillez déposer un fichier au format CSV, XLS ou XLSX avec encodage UTF-8 ou Windows-1252.",
                );
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
            await this.uploadFile(fileTypeEnum.EXCEL);
        }
        if (fileExtension === CSV_EXT) {
            await this.uploadFile(fileTypeEnum.CSV);
        }
    }

    async handleSheetSelected(event: CustomEvent<string>) {
        const selectedSheet = event.detail;
        await this.uploadFile(fileTypeEnum.EXCEL, selectedSheet);
    }

    private async uploadFile(fileType: fileTypeEnum, selectedSheet?: string) {
        this.dispatch("loading");
        await depositLogService.postScdlFile(this.selectedFile!, fileType, selectedSheet);
        // todo : set depositLogStore
        this.dispatch("nextStep");
    }

    handleRestartUpload() {
        this.selectedFile = null;
        this.noFileOrInvalid.set(true);
        this.excelSheets.set([]);
        this.view.set("upload");
    }
}

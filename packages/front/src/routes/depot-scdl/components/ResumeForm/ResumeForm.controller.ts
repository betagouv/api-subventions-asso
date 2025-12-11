import depositLogService, { type FileValidationState } from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";
import type { UploadedFileInfosDto } from "dto";
import { dateToFullFrenchDateWithHour } from "$lib/helpers/dateHelper";

export default class ResumeFormController {
    public fileInfos: UploadedFileInfosDto | undefined;
    public currentView: "siretView" | FileValidationState = "siretView";
    public subTitle: string = "";
    public descState: string = "";
    public allocatorSiret: string = "";
    public formattedDate: string = "";
    public filename: string = "";

    constructor() {
        const depositLog = depositLogStore.value!;
        this.allocatorSiret = depositLog.allocatorSiret!;

        if (depositLog.step === 1) {
            this.currentView = "siretView";
            this.descState = "Il vous reste plusieurs étapes avant de finaliser le dépôt de vos données.";
        }

        const fileInfos = depositLog.uploadedFileInfos;

        if (fileInfos) {
            this.fileInfos = fileInfos;
            this.formattedDate = dateToFullFrenchDateWithHour(fileInfos.uploadDate);
            this.currentView = depositLogService.determineFileValidationState(depositLog.allocatorSiret!, fileInfos);
            this.filename = fileInfos.fileName;

            if (this.currentView === "multipleAllocator") {
                this.subTitle = "Le SIRET attribuant de votre fichier ne correspond pas à celui indiqué";
                this.descState =
                    "Nous avons détecté que votre fichier contient des données pour d’autres SIRET attribuant";
            } else if (this.currentView === "lessGrantData") {
                this.subTitle = "Votre fichier contient moins de lignes de données que ce que nous avons en base.";
                this.descState =
                    "Nous avons détecté que votre fichier contient moins de lignes que ce que nous avons en base.";
            } else if (this.currentView === "blockingErrors") {
                this.subTitle = "Votre fichier contient des erreurs";
                this.descState = "Nous avons détecté des erreurs dans votre fichiers.";
            } else if (this.currentView === "confirmDataAdd") {
                this.descState = "Il ne vous reste plus qu’à valider une étape pour finaliser le dépôt de vos données.";
            }
        }
    }

    async downloadErrorFile() {
        await depositLogService.downloadErrorFile(depositLogStore.value!.uploadedFileInfos!);
    }

    async generateDownloadUrl() {
        await depositLogService.downloadScdlFile(this.filename);
    }

    async handleRestartDeposit() {
        try {
            await depositLogService.deleteDepositLog();
            depositLogStore.set(null);
            return true;
        } catch (e) {
            console.error("Erreur lors de la réinitialisation du dépôt", e); // todo : error handling
            return false;
        }
    }
}
